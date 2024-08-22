---
title: My First Atari Punk Console
tags:
  - electronics
  - DIY synth
---

After going down a few YouTube rabbit holes, I learned about a popular starter project for those interested in DIY synthesizers: [The Atari Punk Console](https://sdiy.info/wiki/Atari_Punk_Console). Also known as the "Stepped Tone Generator", the circuit is driven by two 555 ICs (or one 556 IC). It uses a handful of other components (potentiometers, capacitors, etc), and is super cheap to build.

There's a **ton** of online tutorials for building an Atari Punk Console (APC), each with their own slight variations. I followed [this post from Instructables](https://www.instructables.com/Build-an-Atari-Punk-circuit-on-a-breadboard/), and it worked great!

As described at the bottom of the post, you can swap out the 8ohm speaker with an audio jack. I deviated from the schematic a bit here, and added a 500k potentiometer to act as a volume control.

Here's a snippet of changes I made:

![apc_jack](/assets/images/apc_jack.png)

I also added an on/off switch and an LED to indicate power.

After testing things out on the breadboard, I found an glass jar with a plastic top to use as an enclosure. Instead of a PCB (which would have made things a lot easier), I used a prototype board and soldered everything together. 

Here's how it turned out:

<iframe width="640" height="360" src="https://www.youtube.com/embed/Mqcuazmlhpo"></iframe>
