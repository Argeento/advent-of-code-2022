// @ts-nocheck
import { getLines } from '../utils'

// prettier-ignore
while (!global.root || console.log(root))
  for (let x of getLines(__dirname))
    try { eval('global.' + x.replace(...':=')) } catch (_) {}
