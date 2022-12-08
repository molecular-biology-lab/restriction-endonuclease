import { Transform } from "stream";

export default class RestrictionEndonuclease extends Transform {
  private recognitionSequence: string
  private buffer: string = ''
  constructor(sequence: string) {
    super()
    if(!sequence.match(/[ATGC]+/)) {
      throw new Error(`Invalid recognition sequence: ${sequence}.`)
    }
    if(sequence.length %2 !== 0) {
      throw new Error('The given recognition sequence length should be even number.')
    }
    if(!this.isPalindrome(sequence)) {
      throw new Error('The given recognition sequence is not palindrome.')
    }
    this.recognitionSequence = sequence
  }

  private isPalindrome(_sequence: string) {
    const sequence = _sequence
      .toString()
      .toUpperCase()
      .trim();
    const primer = sequence
      .slice(0, Math.floor(sequence.length / 2))
    const follower = sequence
      .slice(Math.ceil(sequence.length / 2), sequence.length)
      .split('')
      .reverse()
      .join('')

    for (let index = 0; index < primer.length; index++) {
      if(
        (primer[index] === 'A' && follower[index] === 'T') ||
        (primer[index] === 'T' && follower[index] === 'A') ||
        (primer[index] === 'G' && follower[index] === 'C') ||
        (primer[index] === 'C' && follower[index] === 'G')
      ) {
        continue
      } else {
        return false
      }
    }
    return true
  }

  _transform(chunk: string, _1: any, callback: () => void) {
    const basestring = chunk
      .toString()
      .toUpperCase()
      .trim();
    if (
      !basestring
        .split("")
        .every(
          base => base === "A" || base === "T" || base === "G" || base === "C"
        )
    ) {
      throw new Error("Invalid base sequence input");
    }

    this.buffer += basestring
    let recognizedIndex = this.buffer.indexOf(this.recognitionSequence)

    do {
      const dnaFragment = this.buffer.slice(0, recognizedIndex + this.recognitionSequence.length / 2)
      this.buffer = this.buffer.replace(dnaFragment, '')
      recognizedIndex = this.buffer.indexOf(this.recognitionSequence)
      this.push(dnaFragment + '\n');
    } while((this.buffer.length > this.recognitionSequence.length && recognizedIndex !== -1))
    callback();
  }

  end(cb?: (() => void) | undefined): void;
  end(chunk: any, cb?: (() => void) | undefined): void;
  end(chunk: any, encoding?: string | undefined, cb?: (() => void) | undefined): void;
  end(chunk?: unknown, encoding?: unknown, cb?: unknown): void {
    this.push(this.buffer)
    typeof cb === 'function' && cb()
  }

  _flush(callback: () => void) {
    callback();
  }
}
