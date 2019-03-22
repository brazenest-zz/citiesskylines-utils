/**
 * @name SkylinesCurveCalculator
 * @overview Calculates the minimum length of roadway needed to meet real-world safety-and-comfort standards for horizontal curves in the Cities: Skylines city network simulation game.
 * @version 1.0.0.20190322.0
 * @author Alden Gillespy
 * @copyright 2019 Alden Gillespy
 * @license MPL-2.0
 * @package brazenest-CitiesSkylines-utils
 * @hideconstructor
 *
 * Hi! How to use:
 *
 * 1. Define your curve in terms of:
 *      - angle (in degrees)
 *      - design speed (in kmph)
 *      - (optionally) a specific side-friction factor (default is 0.14).
 * 2. Set your values by running the script on your command-line using this structure:
 *      `node skylines-curve-calculator.js {curveAngleDegrees} {curveDesignSpeedKmph} [ {curveSideFrictionFactor} ]`
 * 3. ???
 * 4. $$$$$
 *
 * Feedback? Open a pull request! repo @ https://github.com/brazenest/citiesskylines-utils
 *
 * TODO: Give you all links to the research materials (especially the AASHTO manuals) I've collected as I've learned
 * how to apply real-world build conditions for my highways and other high-speed line segments. Obviously that could
 * help to explain what is a curve's side-friction factor, why did I choose 0.14 for the default.
 */

/**
 * @constant {number}
 * @default */
const DEFAULT_ANGLE_DEGREES = 55

/**
 * @constant {number}
 * @default */
const DEFAULT_DESIGNSPEED_KMPH = 100

/**
 * @constant {number}
 * @default */
const DEFAULT_SIDEFRICTION_FACTOR = 0.14

/**
 * @constant {number}
 * @default */
const DEFAULT_SUPERELEVATION_RATE = 0

const curveAngleDegrees = parseFloat(process.argv[2] || DEFAULT_ANGLE_DEGREES, 10)
const curveDesignSpeedKmph = parseFloat(process.argv[3] || DEFAULT_DESIGNSPEED_KMPH, 10)
const curveSideFrictionFactor = parseFloat(process.argv[4] || DEFAULT_SIDEFRICTION_FACTOR, 10)
const curveSuperelevationRate = parseFloat(process.argv[5] || DEFAULT_SUPERELEVATION_RATE, 10)

const PI = 3.14159
const MAX_RADIANS = 2 * PI
const MAX_DEGREES = 360
const RADIUS_CONSTANT_METRIC = 127
const RADIUS_CONSTANT_IMPERIAL = 15
/**
 * Defines the real-world size of a game square.
 * @constant {number}
 * @default
 */
const U_IN_METERS = 8 // game squares are 8mx8m

// helpers
const radians = (degrees = MAX_RADIANS) => degrees * (MAX_RADIANS / MAX_DEGREES)
const degrees = (radians = MAX_DEGREES) => radians * (MAX_DEGREES / MAX_RADIANS)
const metersToUnits = (meters) => meters / U_IN_METERS
const unitsToMeters = (units) => units * U_IN_METERS
const circumfrence = (radius) => radius * MAX_RADIANS

// Apply the AASHTO equation pertaining to minimum radii for horizontal curves.
const curveRadius = (curveDesignSpeed, varE, varF, radiusConstant = RADIUS_CONSTANT_METRIC) => (curveDesignSpeed * curveDesignSpeed) / (radiusConstant * (varE + varF))
const curveLength = (radius, percent) => Math.ceil(circumfrence(radius) * percent) // rounding up for safety and comfort!

// Get the answer
const myCurveRadius = curveRadius(curveDesignSpeedKmph, curveSideFrictionFactor, curveSuperelevationRate)
const myCurveLength = curveLength(myCurveRadius, curveAngleDegrees / MAX_DEGREES)

// show it!
console.log({
    'MINIMUM (u)': Math.ceil(myCurveLength / U_IN_METERS),
    'angle (deg)': curveAngleDegrees,
    'speed (kmph)': curveDesignSpeedKmph,
    'radius (m)': myCurveRadius,
    'length (m)': myCurveLength,
})
