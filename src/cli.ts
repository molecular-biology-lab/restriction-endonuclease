#!/usr/bin/env node
import process from "process";
import RestrictionEndonuclease from "./";

const sequence = process.argv[2]
process.stdin.pipe(new RestrictionEndonuclease(sequence)).pipe(process.stdout);
