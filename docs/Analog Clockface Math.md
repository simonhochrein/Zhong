# Analog Clockface Math

This is the way Zhong renders the clockfaces in `src/Components/ClockFace.tsx`.

## Step 1

We can use algebra to calculate how many degrees the minute hand should rotate per minute.

Where x is the ratio of degrees per minute, and 60 minutes is the full revolution of the minute hand:

x degrees/minute * 60 minutes = 360 degrees

x degrees/minute = 360 degrees / 60 minutes

x degrees/minute =  6 degrees/minute


Now we can calculate the degrees for the minute hand using the above ratio.

degrees = minutes * 6 degrees/minute

The minute unit of the ratio cancels out, and you are left with degrees

## Step 2

Convert the radius of the minute hand and degrees (calculated above) from a polar equation to a cartesian plane.

x<sub>point</sub> = radius * cos(degrees) and y<sub>point</sub> = radius * sin(degrees)

Now that we have the x and y, we can draw a line to this point from the center.

## Step 3

We have one point of the line, the last step is to calculate the center.

This can be easily done by making x<sub>center</sub> = width / 2, and y<sub>center</sub> = height / 2.

## Example
```
minutes = 5
radius = 2
width = 10
height = 10

--- point
x = 2 * cos(5 * 6)
y = 2 * sin(5 * 6)

--- center
x = 10 / 2
y = 10 / 2

+---------------+
|  (point) .    |
|         /     |
|       *       |
|      (center) |
|               |
|               |
+---------------+
```

## Final notes
For the hour hand, the idea is the same, but the radius is shorter and we have to calculate a different ratio.

Again using algebra to calculate the ratio.

Where x is the ratio, and 12 hours is a full revolution of the hour hand:

x degrees/hour * 12 hours = 360 degrees

x = 360 degrees / 12 hours

x = 15 degrees / hour