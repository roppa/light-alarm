# Light prototype

I bought an Espruino (great bit of kit!) and LED light strip a few years ago and just tinkered around with them every now and then, as you do. Then I read a book "Sleep: The Myth of 8 Hours, the Power of Naps... and the New Plan to Recharge Your Body and Mind" by Nick Littlehales. Ohhh, really interesting, especially about how light can affect different hormone releases. This is my little prototype "light buddy", a light that you can synchronize with throughout the day (90 minute cycles).

I had in mind these states:

 * Off state - during night
 * Dawn/sunset - transition from off to deep red (and vice versa) over 90 period before waking/sleep
 * Daylight - blue/white light
 * Firelights - for the evening when winding down, red/amber lights to mimic fire

## Compact and mobile

Because the Espruino is so small (even the original board, which I'm using - the 'Pico' is even smaller) I wanted to make the prototype small and for use on the go - whether at the desk whilst working or travelling etc.

## Setting time

The correct time is essential. The light buddy is not an alarm, but it must coincide with your sleep and awake schedule.

## Setting sleep and awake times

There are 24 hours in a day, so that is 1,440 minutes. That means there are 16 90 minute cycles in a day. So lets take an example of 12pm bed and 7:30am rise. Thats 5 cycles.

The first 15 minutes would be a winding down into sleep, so therefore a deep red fading out to off mode.

The last 15 minutes of 7:30am would be a transition from off mode into sunrise, then moving to daylight in the next section after 7:30.

During the day would be bright white/blue daylight.

Power naps must also be catered for, 30 or 90 minute cycles.

## States/Colours

Starting in the off position, the first light would be dawn:

![Dusk/dawn colour](/images/dawn-dusk.jpg)

Next would be low daylight, a low blue:

![Dusk/dawn colour](/images/day-low.jpg)

Transitioning to mid:

![Dusk/dawn colour](/images/day-medium.jpg)

And then bright day:

![Dusk/dawn colour](/images/day-bright.jpg)

A prehistoric fire:

![Dusk/dawn colour](/images/fire.jpg)

Transitioning to a dawn/dusk light, then off position. Then the cycle continues.
