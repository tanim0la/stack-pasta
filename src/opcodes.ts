import * as vscode from "vscode";

export class Opcode {
  protected getStack(stack: string): string[] {
    let filteredStack = [];

    // Remove the square bracket []
    const a: string = stack.slice(1, -1);

    for (let item of a.split(",")) {
      if (item.trim() !== "") {
        filteredStack.push(item);
      }
    }

    if (filteredStack.length <= 2) {
      return filteredStack;
    }

    // Find the first ","
    const firstEIndex = a.indexOf(",");

    // Find the second "," after the first one
    const secondEIndex = a.indexOf(",", firstEIndex + 1);

    let item1 = a.slice(0, firstEIndex).trim();
    let item2 = a.slice(firstEIndex + 1, secondEIndex).trim();

    return [item1, item2, a.slice(secondEIndex + 1)];
  }

  // protected getStackLength(stack: string): number {
  //   return stack.slice(1, -1).split(",").length;
  // }

  public execute(opcode: string, stack: string): string {
    switch (opcode) {
      case "add": {
        let getStack = this.getStack(stack);
        console.log(getStack);
        let newStack = `[${getStack[0]} + ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "mul": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} * ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "sub": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} - ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "div" || "sdiv": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} // ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "mod" || "smod": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} % ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "addmob": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} + ${getStack[1]}),${getStack[2]}]`;
        newStack = this.execute("mod", newStack);
        return newStack;
      }
      case "mulmob": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} * ${getStack[1]}),${getStack[2]}]`;
        newStack = this.execute("mod", newStack);
        return newStack;
      }
      case "exp": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} ** ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "signextend": {
        // let getStack = this.getStack(stack);
        // let newStack = `[${getStack[0]} - ${getStack[1]},${getStack[2]}]`;
        // return newStack;
      }
      case "lt" || "slt": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} < ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "gt" || "sgt": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} > ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "eq": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} == ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "iszero": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 1) {
          newStack = `[${getStack[0]} == 0]`;
        } else if (getStack.length === 2) {
          newStack = `[${getStack[0]} == 0, ${getStack[1]}]`;
        } else {
          newStack = `[${getStack[0]} == 0, ${getStack[1]},${getStack[2]}]`;
        }

        return newStack;
      }
      case "and": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} & ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "or": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} | ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "xor": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} ^ ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "not": {
        // let getStack = this.getStack(stack);
        // let newStack = `[${getStack[0]} > ${getStack[1]},${getStack[2]}]`;
        // return newStack;
      }
      case "byte": {
        // let getStack = this.getStack(stack);
        // let newStack = `[${getStack[0]} < ${getStack[1]},${getStack[2]}]`;
        // return newStack;
      }
      case "shl": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[1]} << ${getStack[0]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "shr" || "sar": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[1]} >> ${getStack[0]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "sha": {
        // let getStack = this.getStack(stack);
        // let newStack = `[${getStack[0]} > ${getStack[1]},${getStack[2]}]`;
        // return newStack;
      }
      case "address": {
        // let getStack = this.getStack(stack);
        // let newStack = `[${getStack[0]} < ${getStack[1]},${getStack[2]}]`;
        // return newStack;
      }
      case "balance": {
        // let getStack = this.getStack(stack);
        // let newStack = `[${getStack[0]} > ${getStack[1]},${getStack[2]}]`;
        // return newStack;
      }
      default: {
        return stack;
      }
    }
  }
}
