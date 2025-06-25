package com.patrickdd.statify.utils

import kotlin.time.Duration

class TimeUtils {
    companion object {
        
        /**
         * Takes in a kotlin duration and returns string in DHMS format
         */
        fun formatDuration(duration: Duration): String {
            return duration.toComponents { days, hours, minutes, seconds, _ ->
                "$days days, $hours hours, $minutes minutes, $seconds seconds"
            }
        }
    }
}