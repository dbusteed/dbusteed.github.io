---
title: "DIY Eurorack: Voltage-Controlled Filter"
tags:
  - electronics
  - DIY synth
  - Eurorack
---

[Power supply?](https://dbusteed.github.io/diy-eurorack-dual-power-supply/) Check.

[Case?](https://dbusteed.github.io/diy-eurorack-case-and-passive-multiple/) Check.

It was time to build a real (sorry, [passive multiple](https://dbusteed.github.io/diy-eurorack-case-and-passive-multiple/)) Eurorack module. Many people's first module is an osciliator (given that's where a synthesizer's signal path begins), but I was convinced by strangers on Reddit that a voltage-controlled filter (VCF) is a often an easier place to start.

## Step 1: Schematic

A filter is a key part of any synthesizer, so there were a lot of resources out there for DIY VCFs. I came across [Benjie Jiao's Blog](https://benjiaomodular.com/) and his ["MiniVCF" design](https://benjiaomodular.com/post/2022-03-11-mini-vcf/).

It threw it together on the breadboard, and it worked! Good enough for me for my first build.

<img src="/assets/images/VCF_1465.png" alt="vcf1" width="600"/>

I removed a few features of the design (namely the LEDs and the all pass filter selector) to keep things simple and compact (althogh Ben's design is still smaller than mine, probably thanks to PCBs and more XP). My version of schematic can be found [here](https://github.com/dbusteed/eurorack/db_vcf).

## Step 2: Stripboard Layout

I started making my stripboard layout using [DIY Layout Creator](https://bancika.github.io/diy-layout-creator/). While creating my layout, I referenced a phyiscal piece of stripboard (already cut to size) so I could get a better idea of how things would fit together, especially when it came to give the potentiometers and jacks ample space.

I had one small hiccup here that I'll explain in the next section. Otherwise, this step went smoothly. I prepared for soldering by first drilling trace cuts (and confirming the cuts with a continuity test), as well as trilling thru-holes for my plastic standoffs.

You can find the layout file [here](https://github.com/dbusteed/eurorack/db_vcf).

## Step 3: Assembly

I triple-checked each component and location before soldering, and slowly got each part added to the two pieces of stripboard.

Just to be safe, I did a few more continuity tests. To my surprise, some traces I expected to be isolated were conducting electricity. After scratching my head for a good half hour, I realized I missed something very obvious.

The vertical potentiometers I'm using have hooked legs on two sides. These legs are different from the three leads, and hook into the board adding stability. I didn't think to check these legs for continuity before, but sure enough, the legs are connected and do conduct electricty. 

<img src="/assets/images/VCF_pot.png" alt="potentiometer" width="600"/>

I added more trace cuts and added extra jumpers to keep things inline with the schematic, but next time I will keep this in mind (and maybe use this to my advantage as a free jumper).

With the two boards finished, the last soldering step was to add the wire connections bewteen the two. I've seen others use male + female pins to accomplish this interface, and I might try that approach on a future design. But for this module the 8 or so wires I connected wasn't too much of a pain.

<img src="/assets/images/VCF_1524.png" alt="vcf2" width="600"/>

I bent the wires a bit to clear the space, and attached the standoffs on the other board.

## Step 4: Front Panel

In my [previous post](https://dbusteed.github.io/diy-eurorack-case-and-passive-multiple/) where I built a passive multiple, I discuss how I'm building front panels with free craft wood from Home Depot's Kid Workshops.

I cut a 6-ish HP piece of wood and started drilling some holes. I added a splash of blue paint, squeezed the interfaces thru the holes, and attached the nuts and knobs.

I'm debating if I should add labels to the knobs and jacks, but for now I like the simple look.

<img src="/assets/images/VCF_1541.png" alt="vcf3" width="600"/>

<img src="/assets/images/VCF_1542.png" alt="vcf4" width="600"/>

I gave it a quick test using an [Atari Punk Console](https://dbusteed.github.io/atari-punk-console/) as my oscililator, and I was able to filter sounds!

After I get a few more modules built I'll put together a short video demo, but for now it didn't seem worth the effort. So stay tuned for more!

## Specs

### Size and Power Consumption

| Attribute | Value |
|---|---|
| HP | 6-ish |
| +12V | TODO mA |
| +5V | 0mA |
| -12V | TODO mA |

### TODO Price

| Part | Qty * Price | Total Price |
|---|---|---|
| Jack | 4 * 0.147 | $1.175 |
| Stripboard | 1 * 0.58 | $0.29 |
| Panel | free | $0.00 |
|||$???|
