<!-- 
Demonstrating Differential Privacy in Python
2021/10/01
Python,numpy,stats
-->

## Demonstrating Differential Privacy in Python

Differential privacy (DP) is an interesting concept that I heard about recently.

It's "a system for publicly sharing information about a dataset by describing the patterns of groups within the dataset while withholding information about individuals in the dataset" (thanks [Wikipedia](https://en.wikipedia.org/wiki/Differential_privacy))

Essentially, the goal of DP is to collect data while respecting the privacy of others. A popular example when explaining DP is the following hypothetical use-case:
* Suppose you wanted to know the average income of your group of friends
* Because they are your friends, you feel uncomfortable asking them how much they make (and you want to respect their privacy)

Luckily, we can use a simple application of DP to *estimate* the actual income mean of your friends, without knowing the actual income of a single individual.

Here's what you'd do:
1. Define a normal distribution that you can use to "obscure" actual income values. For example, you may select a normal distribution with a mean of 30,000 and a standard deviation of 20,000
2. Ask each of your friends to take a random number from the "obscure" distribution, and add that to their actual income
3. Take the mean of these obscured incomes that your friends reported, and subtract the mean of the obscured distribution

And just like that, you'll have a fairly accurate estimate of the average income of the group, without anyone feeling awkward.

### Example in Python

Let's demonstrate this concept by programming a simple simulation.

We'll need `numpy` for generating random numbers within a normal distribution, so go ahead and add that import to the script.
```python
import numpy as np  # pip install numpy
```

Next, let's declare some constants for this simulation. We need to choose the number of friends we have, as well as the mean and standard deviation for the actual distribution, and the "obscured" distribution.

```python
N_FRIENDS = 1000
ACTUAL_INCOME_MEAN = 70000
ACTUAL_INCOME_SD = 10000
OBSCURE_MEAN = 30000
OBSCURE_SD = 30000
```

Next, we will need to generate the actual incomes for our friends. Generating a random number within a normal distirbution is super easy with `numpy`, we just need to use the following function:
```python
np.random.normal(mean, stdev)
```

Let's put this function to use, and generate random incomes for all of our friends:
```python
true_incomes = []
for _ in range(N_FRIENDS):
    # i'm converting the result to an `int` just for the heck of it
    income = int(np.random.normal(ACTUAL_INCOME_MEAN, ACTUAL_INCOME_SD))
    true_incomes.append(income)
```

Now that we have a list of all of our friends' incomes, the final step will be to take the mean (because that's what we are interested in finding out in the first place):
```python
true_mean = np.mean(true_incomes)
```

First step complete! But remember, the whole point of differential privacy is to respect the privacy of our friends by not asking them their actual income. For the simulation, we needed to generate the actual incomes, but we'll pretend that we don't actually know this information.

Now for the fun part. We will gather obscured income information from our friends by asking them to tell us the sum of their **actual income** and a **random number** from the "obscure" distribution we chose.

For example, if youe friend Bob makes $100,000 a year, he would first get a random number following the obscured normal distribution (in this case `N~(30,000, 30,000)`). If his random number was -35,000, he would add the two numbers and say his "income" is $65,000. As long as he doesn't also tell us the random number he chose, we have no way of knowing what his actual income is. For all we know, Bob makes $15,000 a year and selected 40,000 for his random number.

Let's simulate this process and add it to the script:
```python
obscured_incomes = []
for inc in true_incomes:
    _inc = inc + int(np.random.normal(OBSCURE_MEAN, OBSCURE_SD))
    obscured_incomes.append(_inc)
```

Next, let's take the mean of the obscured incomes we gathered, and substract the mean of the obscured distribution we used to get random numbers.

```python
estimated_mean = np.mean(obscured_incomes) - OBSCURE_MEAN
```

That's it! We've successfully estimated the average income of our friends without invading anyone's privacy. Let's print the `true_mean` and the `estimated_mean` to see how close our estimate was.

```python
print(f'   actual mean: {true_mean}')
print(f'estimated mean: {estimated_mean}')
```

If you used the same constant values shown above, your estimate will most likely should be within $1,000 of the actual average, which is pretty cool.

### Full Script
```python
import numpy as np

N_FRIENDS = 1000
ACTUAL_INCOME_MEAN = 70000
ACTUAL_INCOME_SD = 10000
OBSCURE_MEAN = 30000
OBSCURE_SD = 20000

true_incomes = []
for _ in range(N_FRIENDS):
    income = int(np.random.normal(ACTUAL_INCOME_MEAN, ACTUAL_INCOME_SD))
    true_incomes.append(income)

true_mean = np.mean(true_incomes)

obscured_incomes = []
for inc in true_incomes:
    _inc = inc + int(np.random.normal(OBSCURE_MEAN, OBSCURE_SD))
    obscured_incomes.append(_inc)

estimated_mean = np.mean(obscured_incomes) - OBSCURE_MEAN

print(f'   actual mean: {true_mean}')
print(f'estimated mean: {estimated_mean}')
```