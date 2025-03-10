import { useState } from 'react'

export default function useSortingAlgorithm() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1000)
    const [array, setArray] = useState([])

    async function runAlgorithm(algorithm) {
        setIsPlaying(true)
        await algorithm([...array], setArray, speed)
        setIsPlaying(false)
    }

    return {
        isPlaying,
        speed,
        array,
        setArray,
        setSpeed,
        runAlgorithm
    }
}
