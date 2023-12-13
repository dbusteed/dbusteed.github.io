---
title: Dual Booting Windows 11 and EndeavourOS
tags:
  - Linux
  - system administration
excerpt: A high-level walkthrough of installing EndeavourOS
description: A high-level walkthrough of installing EndeavourOS
---

I've been using Ubuntu Budgie for the last 3 years, but I recently got a new laptop and decided to switch things up and try EndeavourOS. Until now, I've only had experience with Debian- and RedHat-based distros, so this will be my first time using Arch. From what I've read online, EndeavourOS is an easy introduction to Arch, so I thought it would be a fun distro to try out.

I occasionally need to use Windows (unfortunately), so I've decided to dual boot Windows 11 with EndeavourOS.

> **NOTE:** This article is less of a walkthrough, and more of a log of the steps I took. I won't cover all the details, so you might need to lookup a few other resources if you get stuck.

## Step 1: Windows Setup

Before installing EndeavourOS, I made some changes to my Windows installation.

### Step 1A: Create Free Space on Disk

I used the Disk Management tool on Windows to shrink my C drive and create some free space on the disk for EndeavourOS.

### Step 1B: Disable Fast Startup

Windows has an option called "fast startup" which, as you may have guessed, helps Windows start up quicker. This option allows Windows to hibernate for short periods rather than completely shutting down. This can cause issues when dual booting because the live USB will notice that another OS is still running on the system, and won't be able to boot.

### Step 1C: Disable Secure Boot

From what I've read online, this *might not always be necessary*, but I had issues booting my USB until I disabled Secure Boot. I pressed F2 while turning on my laptop to enter the UEFI menu, where I located the Secure Boot option and disabled it.

## Step 2: Prepare the Live USB

Next, I prepared the "live USB" for installing EndeavourOS. I downloaded the latest `*.iso` from [https://endeavouros.com/](https://endeavouros.com/), and then flashed it to a USB using [etcher](https://www.balena.io/etcher/).

## Step 3: Boot the USB and Install EndeavourOS

### Step 3A: Boot the Live USB

Now it was time to boot the USB and get started with the installation. After a few online searches, I found that my laptop had a "BOOT" button (F12) that can be used to directly choose a boot source, rather than starting UEFI/BIOS and selecting the boot medium there. 

After selecting the USB, I was given on option to choose "normal" EndeavourOS, or a version with proprietary NVIDIA drivers. I went the latter because my laptop has a NVIDIA GPU, and I'm not necessarily an "open-source purist".

After that selection, I saw a lot of output as EndeavourOS started to boot up, as well as a message saying: **Welcome to EndeavourOS!**

In a few minutes, the live USB was up-and-running, and I was able to start playing around with EndeavourOS.

### Step 3B: Install EndeavourOS

After testing the live USB for a few minutes, it was time to open up the installer.

1. EndeavourOS gives options for an **offline** and **online** installer. The **online** installer requires internet access, but gives you more options on which packages are installed. Most importantly, it allows you to choose a different desktop environment than the standard XFCE. I wanted to use the Cinnamon DE so I did the **online** installer
1. Next, I setup my language, location, and keyboard layout
1. Next was the disk partitioning. There's a lot of resources out there on the *best* way to partition your Linux setup, which can be kind of confusing. After reading up on the motivations behind the different partitions schemes, I decided to create the following partitions:
    * 512 MB (FAT32) mounted at `/boot/efi` with the `boot` flag
    * Remaining free space (500+ GB, ext4) mounted at `/` with the `root` flag
1. After confirming the partition setup, I selected the components I wanted to install. I selected the Cinnamon desktop environment as well as the LTS Linux kernel (I've heard the LTS kernel can help out with NVIDIA-related bugs, so I'm adding it to be safe)
1. I finished up the installation by making my user account, and confirming my selections
1. When the installation finished, I restarted my laptop

## Step 4: Confirm Everything is Working

After restarting, my laptop displayed the boot loader for EndeavourOS. There was an option for booting into EndeavourOS and one for booting into Windows via the Windows Boot Manager. To make sure everything worked, I loaded up EndeavourOS, then restarted the laptop again and booted into Windows. Both OSs worked as expected, so the everything was successful.
