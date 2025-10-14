declare global {
  interface String {
    capitalize(): string;
  }
}

if (!String.prototype.capitalize) {
  Object.defineProperty(String.prototype, "capitalize", {
    value: function (): string {
      return this.replace(/^(\p{L})/u, (c: string) => c.toUpperCase());
    },
    writable: false,
    configurable: false,
  });
}

export {};
