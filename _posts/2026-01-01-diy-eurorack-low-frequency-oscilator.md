---
title: "DIY Eurorack: Low Frequency Oscilator"
tags:
  - electronics
  - DIY synth
  - Eurorack
---

"What's the point of modular synthesis if you're not modulating something?"

I heard something along those lines when first getting into modular and it stuck with me. I knew after making the basic setup of a VCA + VCA + VCF, I'd need a module to act as a modulation source that could plug into a few of the CV inputs on my previous modules.

Enter the **Low Frequency Oscilator**. As with other module types, there are tons of designs and approaches for LFOs. I was tempted to go big with a multi-LFO output with CV inputs for every control (which would allow modulating the modulators), but I decided to keep it simple for my first LFO build.

## Step 1: Schematic

I found [Benjie's MiniLFO](https://benjiaomodular.com/post/2023-04-19-minilfo/) which itself is based on [David Haillant's Simple LFO](https://www.davidhaillant.com/wp/wp-content/uploads/lfo-1.5b-20210205.pdf). The design uses a TL074 as a Schmitt Trigger which creates a square wave, and then uses a separate op-amp to convert that square wave into a triangle wave.

I combined ideas from both schematics, although my final design was closer to Halliant's because I wanted a switch to toggle between square and triangle outputs. I added a voltage divider on the triangle to keep the output level closer to the square's level.

I also didn't have a non-polar LED on hand, so I opted for a single LED with a 1N4148 diode in anit-parallel. This LED will only light up during one-half of the cycle, which is fine with me as it still provides some indication of the LFO rate.

## Step 2: Stripboard Layout

Nothing special here, aside from re-using a trick from my VCO build, where I cut out a section of the stripboard to make way for the switches. Luckily I didn't need to connect power from the back board to the front, but I still had quite a few wires to connect which is the most annoying part of this build style. Oh well.

## Step 3: Assembly

Assembly went smoothly. Grabbed some red paint from the kids' arts and crafts box, used my best handwriting (which is terrible) to label the panel and I was done!

Here's the full setup so far (LFO in red):

<img src="/assets/images/lfo.jpg" alt="lfo" width="600"/>

## Demo

Quick demo of the LFO:

<iframe width="640" height="360" src="https://www.youtube.com/embed/ea3xIqGEKo4"></iframe>

## Specs

### Size and Power Consumption

| Attribute | Value |
|---|---|
| HP | 7-ish | 
| +12V | 4 mA |
| +5V | 0 mA |
| -12V | 4 mA |

### Price

Op-amp (\\$0.5), knobs and pots (\\$1), switches and jacks (\\$1), panel (free!), other stuff = **about \\$4**.

Read about how I'm making my panels at the bottom of [this post](https://dbusteed.github.io/diy-eurorack-case-and-passive-multiple/).

### Project Files

Checkout the [schematic, stripboard layout, and other files here](https://github.com/dbusteed/eurorack/tree/master/db_lfo)
