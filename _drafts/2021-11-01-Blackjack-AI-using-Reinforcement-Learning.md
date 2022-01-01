---
tags:
  - Python
  - machine learning
---

## Simulation Approach

RL is all about deciding the best next action given a particular state. In Blackjack, the *states* will be cards the agent is holding, and the *action* will be the agent's decision to **stand** or **hit**. As you would imagine, the decision to **stand**/**hit** depends entirely on the cards you were dealt.

Keeping track of these 

Before we start writing code, let's go over the approach we will take to help our automated agent learn to play Blackjack.

First, we'll want to define what our *states* and *actions* will look like in a Blackjack environment.



```
{
  state_1: {
    action_1: [avg_success_rate, count],
    action_2: [avg_success_rate, count],
  },
  state_2: {
    action_1: [avg_success_rate, count],
    action_2: [avg_success_rate, count],
  },
  ...
}
```

## Let's get started!

First, let's add the required libraries, as well as define a few enums:

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
# in Blackjack, so this is relatively easy
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
# handle aces last because they can take the value of
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
# it's helpful to add a '*' when an ace is present
# to distinguish between a normal hand and one with
# an ace (which can change values)
def get_hand_key(hand):
    hand_key = str(get_hand_value(hand))
    if 'A' in hand:
        hand_key += '*'
    return hand_key


def get_max_val(obj):
    idx = np.argmax(list(obj.values()), axis=0)
    return list(obj.keys())[idx][0]
```

Awesome. We have one last step before implementing the RL model, which is to write the funcion that will evaluate the agent's action given the deck, the agent's hand, and the dealer's hand. Essentially, this function encapsulates the core logic of the Blackjack game.

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

Great, now we can start writing the meat of the RL process, which will be in the `play_blackjack(...)` function. Our agent will learn the rules of the game by playing multiple times, so putting the "play" code into a single function will make it easier to play N games later on.

We'll start the function out with some intial variables before starting the game (more details on the parameters later):
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

The first thing we'll do in the loop is evaluate the status of the Blackjack game using the `eval_blackjack(...)` function:
```python
        deck, state, hand, dealer, action = eval_blackjack(
            deck, state, hand, dealer, action
        )
```

For the first stage of the game, `hand`, `dealer`, and `action` are all set to `None`, so this function will return a new `hand` consisting of two cards.

Each time the agent enters a new state, we'll want to update our `states` dictionary which keeps track of the past states, actions, and the actions success rate. As explained above, each unique *state* will be the first layer of keys in our `states` dictionary, so the first thing we'll need to do is detemine the "state key" for the current state.

We already wrote the `get_hand_key(...)` function, so this will be easy:
```python
        key = get_hand_key(hand)
```

Now, we will want to handle the game depending on the `state` variable from the `eval_blackjack()` function. The variable names are a little confusing here (my apologies); this `state` refers to the state of the current game.

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
    * `mu += (1 / count) * (result - mu)`
* Next, we'll want to repeat these steps for the different states that led the agent to this point. For example, if the agent beat the dealer with a hand of `[4, 4, 5, K]`, we want to make sure that we update the `states` dictionary to indicate that "hitting" on `[4, 4]` and `[4, 4, 5]` resulting in a success. We'll do this by setting the action to `HIT`, removing one card at a time, and updating the *avg_success_rate* for that state

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