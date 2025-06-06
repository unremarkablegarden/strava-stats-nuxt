module.exports = {
    separator: "_",
    theme: {
        darkMode: "media",
        height: (theme) => ({
            auto: "auto",
            ...theme("spacing"),
            full: "100%",
            screen: "100svh",
            "1x2": "50%",
            '100vh': '100vh',
            '90vh': '90vh',
            '100svh': '100svh',
        }),
        width: (theme) => ({
            auto: "auto",
            ...theme("spacing"),
            "1x2": "50%",
            "1x3": "calc(100% * 1/3)", // 33.333333%',
            "2x3": "calc(100% * 2/3)", // 66.666667%',
            "1x4": "25%",
            "2x4": "50%",
            "3x4": "75%",
            "1x5": "20%",
            "2x5": "40%",
            "3x5": "60%",
            "4x5": "80%",
            "1x6": "calc(100% * 1/6)", // 16.666667%',
            "2x6": "calc(100% * 2/6)", // 33.333333%',
            "3x6": "50%",
            "4x6": "calc(100% * 4/6)", // 66.666667%',
            "5x6": "calc(100% * 5/6)", // 83.333333%',
            "1x12": "calc(100% * 1/12)", // 8.333333%',
            "2x12": "calc(100% * 2/12)", // 16.666667%',
            "3x12": "25%",
            "4x12": "calc(100% * 4/12)", // 33.333333%',
            "5x12": "calc(100% * 5/12)", // 41.666667%',
            "6x12": "50%",
            "7x12": "calc(100% * 7/12)", // 58.333333%',
            "8x12": "calc(100% * 8/12)", // 66.666667%',
            "9x12": "75%",
            "10x12": "calc(100% * 10/12)", // 83.333333%',
            "11x12": "calc(100% * 11/12)", // 91.666667%',
            full: "100%",
            screen: "100vw",
            grid_20: "calc(100% + 4rem)",
            '100vw': '100vw',
            '50vw': '50vw',
            '75vw': '75vw',
            '25vw': '25vw',
        }),
    },

    content: [
        `/components/**/*.{vue,js,ts}`,
        `/layouts/**/*.vue`,
        `/pages/**/*.vue`,
        `/composables/**/*.{js,ts}`,
        `/plugins/**/*.{js,ts}`,
        `/App.{js,ts,vue}`,
        `/app.{js,ts,vue}`,
        `/Error.{js,ts,vue}`,
        `/error.{js,ts,vue}`,
    ],
}
