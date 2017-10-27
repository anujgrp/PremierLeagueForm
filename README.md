# PremierLeagueForm

## Description

Web app that displays a line chart visualizing the form of English Premier League teams.

Allows for user to change variables such as the Y-Axis value, teams displayed, league season, and even draw a vertical line to emphasize form at certain periods during the season.

### Examples

![Example](/img/example-1.png)
Chelsea vs Arsenal (16/17) with a line showing the matchday of their first game against each other.

![Example](/img/example-2.png)
Hovering over the circle representing that game and showing the score while highlighting the line.

![Example](/img/example-3.png)
Hovering over Tottenham key in the upper right to highlight the line.

### Technologies Used

HTML/JS, D3.js, jQuery, Express

## Install

### Requirements

Node

### Directions

1. `git clone https://github.com/kyledijkstra/PremierLeagueForm.git`

2. `cd PremierLeagueForm`

3. `npm install`

4. `node server`

5. Visit localhost:9000 on your web browser

## User Guide

### General

Hover over a line, or its key in the upper right, to highlight that line on the chart.

Hover over a dot on a line to show the result from that game.

Delete individual line from chart by clicking the X next to the key of that line.

### Chart Type

#### Y Axis

Users can select from 3 different Y-axis values: Avg Pts, Avg GD, and League Position.

Avg Pts: takes the rolling average of points taken (loss=0, draw=1, win=3) from the last number of games

Avg GD: takes the rolling average of goal difference from the last number of games

League Position: this is only useful when comparing two separate lines; it does not give an actual Y value which means it only visualizes whether one team finished above another and by how much, not actual league position such as 1-20.

#### Rolling Avg

Changes the length of the rolling average for Avg Pts or Avg GD.

### Add Team

User selects team, season, and color. Then click Add to draw the line on the chart. Clear All erases all lines off of the chart.

### Vertical Line

Draws a dashed, vertical line coming out of the X-axis at the matchday selected in the color selected.

Delete a vertical line by double clicking it.
