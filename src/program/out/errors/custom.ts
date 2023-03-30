export type CustomError = Unauthorized

export class Unauthorized extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "Unauthorized"
  readonly msg = "Unauthorized"

  constructor(readonly logs?: string[]) {
    super("6000: Unauthorized")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new Unauthorized(logs)
  }

  return null
}
