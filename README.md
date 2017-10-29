# Light alarm

I bought an Espruino and LED light strip a few years ago and just tinkered around with them every now and then, as you do. Then I read a book "Sleep: The Myth of 8 Hours, the Power of Naps... and the New Plan to Recharge Your Body and Mind" by Nick Littlehales. Ohhh, really interesting, especially about how light can affect different hormone releases. This is my little prototype "light buddy", a light that you can synchronize with throughout the day (90 minute cycles).

I had in mind these states:

 * Off state - during night
 * Dawn/sunset - transition from off to deep red (and vice versa) over 90 period before waking/sleep
 * Daylight - blue/white light
 * Firelights - for the evening when winding down, red/amber lights to mimic fire

## Setting time

The correct time is essential. The light buddy is not an alarm, but it must coincide with your sleep and awake schedule.

## Setting sleep and awake times

There are 24 hours in a day, so that is 1,440 minutes. That means there are 16 90 minute cycles in a day. So lets take an example of 12pm bed and 7:30am rise. Thats 5 cycles.

The first 15 minutes would be a winding down into sleep, so therefore a deep red fading out to off mode.

The last 15 minutes of 7:30am would be a transition from off mode into sunrise, then moving to daylight in the next section after 7:30.

During the day would be bright white/blue daylight.

Power naps must also be catered for, 30 or 90 minute cycles.
