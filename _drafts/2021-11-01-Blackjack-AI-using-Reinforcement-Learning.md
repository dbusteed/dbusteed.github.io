---
tags:
  - Python
  - machine learning
---

Reinforcement learning is an area of machine learning concerned with how intelligent agents ought to take actions in an environment in order to maximize the notion of cumulative reward (thanks [Wikipedia](https://en.wikipedia.org/wiki/Reinforcement_learning)). Our friends on Wikipedia also write that reinforcement learning (RL) is one of three basic machine learning paradigms, alongside supervised learning and unsupervised learning.

Although the majority of the "machine learning" use cases I work on fall under the supervised learning category, I think RL best embodies the idea of a *machine* (in this case, a computer program) *learning* how to do something.

When I started to learn more about RL, I thought it would be fun to write a program in which an AI learns how to play Blackjack. Rather than get buried in the nitty gritties of RL theory, this post will cover the basic concepts of RL and then focus on writing a (somewhat) simple Python program to achive this.

## RL Basics

The core concepts we'll need to understand are ***agent***, ***state***, ***action***, and ***reward***.

### Agent

As noted in the Wiki definition, RL is centered on an ***agent(s)***. This is the thing that will be doing the learning. In our Blackjack example, the agent is the "player" who plays against the dealer in an attempt to make some money.

### State

***State*** is simply the current state of the game (very redundant definition, I know). The agent will find itself in different states as it goes through the RL process. In order to learn from past events, the agent will need to keep a record of the different states it has been in.

There isn't a set format for what a ***state*** should look like. Even in our Blackjack example, we could define the state in a number of ways:
1. The number of cards the agent (the player) is currently holding
2. The total point value of the cards the agent is holding
3. A list of the actual cards the agent is holding (including the suit of each card)

We'll come back to this design decision after reviewing the other concepts.

### Action

Next are ***actions***. An agent will have a list of possible actions they can take during the simulation. The agent wants to "perform well" in the simulation, so it will attempt to choose the best action (given the current state) that will lead to a "positive outcome". This is very easy to conceptualize in Blackjack, because there are only two decisions a player can make: "stand" and "hit" (we're ignoring "split" in this example). We'll get into the details in a bit, but for now just remember that the action is essentially the decision the agent makes during the game.

### Reward

The ***reward*** is what motivates the RL agent to learn. Again, this is very straightforward in Blackjack, because the goal of Blackjack is to win each hand by beating the dealer. We'll take the necessary steps in our program to indicate that winning each hand is the "positive outcome" that the agent should be working towards.

### Putting it All Together

Understanding how these pieces fit together will be clear when we start programming, but for now here's the main thing to remember:

    The agent selects an action given the current state, based on the previous rewards of that given state-action pair

## Design Decisions

Before we start writing code, let's layout some of the implementation details of our Blackjack RL agent. 

### State Revisited

First, we'll need to revisit the question of how we should represent the ***state*** in our simulation. We'll want to record the state in a way that the agent has the most relevant information it needs to make a decision, while at the same time keeping it broad enough so that we don't have too many possible states.

If we represented the state as the number of cards the agent was holding (option #1), we'd be ignoring a lot of crucial information. This would essentially be playing Blackjack without looking at your cards.

If we represented the state by taking a list of the cards and their suits (option #3), we would be keeping track of irrelevant data, because the suit of the cards don't matter in Blackjack. By taking this approach, we expand the number of possible states the agent needs to keep track of, which will make it harder for it to learn.

We're going to stick with option #2, which is to treat the total point value of the agent's cards as the state. We might be sacrificing some information by not focusing on the actual cards, but this will still work fairly well.

### Data Structures

Now that we have that sorted out, we'll need to decide how we'll want to store the state information. Keeping a record of each time the agent plays a hand (and the result) is crucial to the RL process. Let's quickly remind ourselves how the ***state*** and ***action*** are related:
* As the agent plays through the simulation, it will encounter different states
* At each state, it will need to choosed an action ("stand" or "hit")
* Each action will eventualy result in a win (positive result) or a loss (negative result)

These concepts are quite nested (a state has actions, these actions have results, etc), so I imagine a Python dictionary will keep this data organized and easy to access. We'll use a nested dictionary with the states as the outer keys, and the two actions as the inner keys.
```
{
  state_1: {
    action_1: result,
    action_2: result,
  },
  state_2: {...},
  state_3: {...},
  ...
}
```

The `result` above is intentionally a bit vague because there's a little more brainstorming we'll need to do in order to keep track of the "success rate" of each action. As the agent plays through multiple Blackjack games, it will be updaing this "success rate" *incrementally*, which means we'll need to periodically calculate the *incremental mean*.

The incremental mean allows us to keep an acurate representation of the mean without storing the result of each iteration. The formula is relatively simple:
    
    avg += (1 / count) * (new_value - avg)

Essentially, we take the difference between the new value and the average, and scale that by `1/count`. Then we take that result and add it to the mean to compute the new mean.

With all this in mind, we'll want to keep a record of the `avg_success_rate` (the mean) for a given state-action combo, as well as the total number of times this state-action combo was used (the count). We could use another nested dictionary for this, or we could keep it simple by using a list. Here's a more complete picture of how we'll keep track of the states and actions:
```
{
  state_1: {
    action_1: [avg_success_rate, count],
    action_2: [avg_success_rate, count],
  },
  state_2: {...},
  state_3: {...},
  ...
}
```

## Let's get started!

Alrighty, we've covered the basic concepts needed to start writing code. We'll touch a few more features of RL as we start putting things together, but for now let's get started.

First, let's add some required libraries, as well as define a few enums:

```python
import matplotlib.pyplot as plt
import numpy as np
from enum import Enum
from random import shuffle, choice

# these aren't necessary, but are nice to have
from pprint import pprint
from tqdm import tqdm 


# Enum for managing a Blackjack game, hence `Gamestate`, 
# not to be confused with the `state` in our RL model
class Gamestate(Enum):
    ONGOING = 'ongoing'
    WON = 'won'
    LOST = 'lost'
    DRAW = 'draw'


# the two actions the agent can take in Blackjack
class Action(Enum):
    STAND = 0
    HIT = 1
```

Next, we'll define some helper functions. The purpose of these functions will be clear when we start to use them, but the comments will give a brief description:

```python
# create a deck of cards. suit doesn't matter
# in Blackjack, so this is pretty easy
def get_deck():
    deck = [
        '2', '3', '4', '5',
        '6', '7', '8', '9',
        '10', 'J', 'Q', 'K', 'A'
    ]
    deck *= 4
    shuffle(deck)
    return deck


# get the numeric value of a `hand`. we need to 
# handle Aces last because they can take the value of
# 1 or 11, depending on the value of other cards
def get_hand_value(hand):
    val = 0
    for card in [c for c in hand if c != 'A']:
        if card in ('J', 'Q', 'K'):
            val += 10
        else:
            val += int(card)
    for card in [c for c in hand if c == 'A']:
        if val <= 10:
            val += 11
        else:
            val += 1
    return val


# get a representation of the hand value. for most 
# cases this is just the numeric hand value, but 
# it's helpful to add a '*' when an Ace is present
# to distinguish between a normal hand and one with
# an Ace (which can change values)
def get_hand_key(hand):
    hand_key = str(get_hand_value(hand))
    if 'A' in hand:
        hand_key += '*'
    return hand_key


def get_max_val(obj):
    idx = np.argmax(list(obj.values()), axis=0)
    return list(obj.keys())[idx][0]
```

Awesome. We have one last step before implementing the RL model, which is to write the function that will evaluate the agent's action given the deck, the agent's hand, and the dealer's hand. Essentially, this function encapsulates the core logic of the Blackjack game.

The function will take the `deck`, `state`, `hand`, `dealer`, and `action` parameters, make some changes, and return the same variables. This setup is a little clunky, but will work fine for this use-case. Rather than a bloated OOP implementation with a `Game` class that keeps track of the `deck` and the different players' cards, we just need to keep track of the `deck`, `hand`, and `dealer`, as well as the `state` the game is in, and the `action` the agent took.

To start a new game, we simply don't provide `hand`, `dealer`, and `action`. The function will draw two cards for the agent and for the dealer.

Otherwise, the function will evaluate the agent's `action`, and make the appropriate checks:
* If the agent chose to **STAND**, we'll first draw cards for the dealer until they have a value of 18 or greater, then we'll compare the values of `dealer` and `hand`, and determine if the agent won or not
* If the agent chose to **HIT**, we'll deal them a new card, and at the same time check if their new value is over 21 (which is a bust)

```python
def eval_blackjack(deck, state, hand=None, dealer=None, action=None):
    if hand and dealer and (action != None):
        if action == Action.STAND:
            while get_hand_value(dealer) < 18:
                dealer.append(deck.pop())
            h_val = get_hand_value(hand)
            d_val = get_hand_value(dealer)
            
            if h_val > 21:
                state = Gamestate.LOST
            elif d_val > 21:
                state = Gamestate.WON
            elif h_val > d_val:
                state = Gamestate.WON
            elif h_val < d_val:
                state = Gamestate.LOST
            else:
                state = Gamestate.DRAW
        
        elif action == Action.HIT:
            hand.append(deck.pop())
            if get_hand_value(hand) > 21:
                state = Gamestate.LOST
                hand.pop()
    else:
        hand = [deck.pop(), deck.pop()]
        dealer = [deck.pop(), deck.pop()]

    return (deck, state, hand, dealer, action)
```

Great, now we can start writing the meat of the RL process, which will be in the `play_blackjack` function. Our agent will learn the rules of the game by playing many rounds, so putting the "play" code into a single function will make it easier to play `N` games later on.

We'll start the function off with some intial variables before starting the game (more details on the parameters later):
```python
def play_blackjack(states, eps):
    deck = get_deck()  # each game needs a fresh deck of cards
    state = Gamestate.ONGOING
    hand = None    # placeholder vars for the agent's cards,
    dealer = None  # and for the dealer's cards
    action = None
```

Because a single Blackjack game consists of several stages (each with a *state* and *action*), we'll setup a `while` loop that will continue until the game has ended:
```python
    while state == Gamestate.ONGOING:
```

The first thing we'll do in the loop is evaluate the status of the Blackjack game using the `eval_blackjack` function:
```python
        deck, state, hand, dealer, action = eval_blackjack(
            deck, state, hand, dealer, action
        )
```

For the first stage of the game, `hand`, `dealer`, and `action` are all set to `None`, so this function will return a new `hand` consisting of two cards.

Each time the agent enters a new state, we'll want to update our `states` dictionary which keeps track of the past states, actions, and the actions success rate. As explained above, each unique *state* will be the first layer of keys in our `states` dictionary, so the first thing we'll need to do is detemine the "state key" for the current state.

We already wrote the `get_hand_key` function, so this will be easy:
```python
        key = get_hand_key(hand)
```

Now, we will want to handle the game depending on the `state` variable from the `eval_blackjack` function. The variable names are a little confusing here (my apologies); this `state` refers to the state of the current game.

If the game is still being played (`state == Gamestate.ONGOING`), we want to do the following:
* Check if this is the first time the agent has entered this state:
    * If yes, add this state to the `states` dict, and then chose a random action (because we don't know which action is best)
    * If no, we will chose the action (for the given state) that has the highest success rate.
* Increment the count for the state-action pair

So for example, if the agent is holding a ten and an eight, the `key` would be `'18'`. If `states['18']` was `{STAND: [.90, 10], HIT: [.25, 4]}`, the agent would select `STAND` as the action, because **.90 > .25**

Here's what that'll look like in code:
```python
        if state == Gamestate.ONGOING:
            if key not in states:
                states[key] = {
                    Action.STAND: [0, 0],
                    Action.HIT: [0, 0]
                }
                action = choice([Action.STAND, Action.HIT])
            else:
                action = get_max_val(states[key])

            states[key][action][1] += 1
```

That's it! Well, it's almost it. We'll revisit this block later. But for now, let's handle the end-of-game scenerios.

Here's the basic process:
* Assign a value to the result of the game. This acts as the *reward* function, so we'll want the result to be `1` when the agent wins, and `0` otherwise
* Update the *avg_success_rate* for the state-action combination by using the count to compute the incremental mean
    * Reminder: `avg += (1 / count) * (result - avg)`
* Next, we'll want to repeat these steps for the different states that led the agent to this point. For example, if the agent beat the dealer with a hand of `[4, 4, 5, K]`, we want to make sure that we update the `states` dictionary to indicate that "hitting" on `[4, 4]` and `[4, 4, 5]` resulted in a success. We'll do this by setting the action to `HIT`, removing one card at a time, and updating the *avg_success_rate* for that state.

Alright here's what that will look like:
```python
        elif state == Gamestate.DRAW:
            result = 0  # ignore DRAW cause noone wins

        else:
            result = 1 if state == Gamestate.WON else 0

            states[key][action][0] += ((1 / states[key][action][1]) * (result - states[key][action][0]))

            hand.pop()
            action = Action.HIT

            while len(hand) > 1:
                key = get_hand_key(hand)
                states[key][action][0] += ((1 / states[key][action][1]) * (result - states[key][action][0]))
                hand.pop()
```

note about how we arne't programming rules, it can learn the game!