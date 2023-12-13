---
title: Block Puzzle Game with React
tags:
  - React
  - Javascript
  - Playable
---

> Play the game [here](https://dbusteed.github.io/block-puzzle/)

I find it interesting when people use a programming language / framework outside of it's intended use cases. Oftentimes this happens when the developer simply doesn't know any better (we've all been there), but sometimes people just do something weird for the sake of doing it.

I was building a POC for a web application that required a grid of objects that could be customized by the user. I came across the [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) library that was perfect for my usecase. After finishing my project, I had the funny idea of using `react-grid-layout` to make a puzzle game.

The object of the game is to rearrange blocks of different sizes to fit nicely in the provided area. The `react-grid-layout` handles the annimations and the "stacking logic", so all I really had to do was do a basic UI design, create some levels, and add some logic for checking if the player has completed the level.

![block_puzzle.png](/assets/images/block_puzzle.png)

Check out the code [here](https://github.com/dbusteed/block-puzzle)
