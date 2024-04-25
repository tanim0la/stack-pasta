import * as vscode from "vscode";

export class Opcode {
  public reverveStack(stack: string): string {
    let stackArr = stack.slice(1, -1).split(",");
    let reversedStackArr = stackArr.reverse();

    let newStack = `${reversedStackArr.map((item) => {
      return ` ${item.trim()}`;
    })}`.trim();

    return `[${newStack}]`;
  }

  public filterStack(arr: string[]): string[] {
    let filteredStack = [];

    for (let item of arr) {
      if (item.trim() !== "") {
        filteredStack.push(item.trim());
      }
    }
    return filteredStack;
  }

  protected checkUndefined(stack: string): string {
    return stack.includes("undefined") ? `[stack_underflow]` : stack;
  }

  protected getStack(stack: string): string[] {
    const a: string = stack.slice(1, -1);

    let filteredStack = this.filterStack(a.split(","));

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

  public execute(opcode: string, stack: string): string {
    let tempOpcode = opcode;
    if (tempOpcode.includes("0x")) {
      opcode = "push";
    } else if (
      tempOpcode.slice(0, 3) === "dup" &&
      parseInt(tempOpcode.slice(3)) <= 16 &&
      parseInt(tempOpcode.slice(3)) >= 1
    ) {
      opcode = "dup";
    } else if (
      tempOpcode.slice(0, 4) === "swap" &&
      parseInt(tempOpcode.slice(4)) <= 16 &&
      parseInt(tempOpcode.slice(4)) >= 1
    ) {
      opcode = "swap";
    } else if (
      tempOpcode.slice(0, 3) === "log" &&
      parseInt(tempOpcode.slice(3)) <= 4 &&
      parseInt(tempOpcode.slice(3)) >= 0
    ) {
      opcode = "log";
    } else if (tempOpcode.includes("[") && tempOpcode.includes("]")) {
      tempOpcode = opcode.slice(1, -1);
    } else if (
      tempOpcode.includes(")") &&
      (tempOpcode.includes("__FUNC_SIG(") ||
        tempOpcode.includes("__EVENT_HASH(") ||
        tempOpcode.includes("__ERROR(") ||
        tempOpcode.includes("__RIGHTPAD(") ||
        tempOpcode.includes("__codesize(") ||
        tempOpcode.includes("__tablestart(") ||
        tempOpcode.includes("__tablesize("))
    ) {
      opcode = "builtin";
    } else if (tempOpcode.includes("(") && tempOpcode.includes(")")) {
      opcode = "macrofunction";
    }

    switch (opcode) {
      case "add": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} + ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "mul": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} * ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "sub": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} - ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "div": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} // ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "sdiv": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} // ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "mod": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} % ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "smod": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} % ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "addmod": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} + ${getStack[1]}),${getStack[2]}]`;
        newStack = this.execute("mod", newStack);

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "mulmod": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} * ${getStack[1]}),${getStack[2]}]`;
        newStack = this.execute("mod", newStack);

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "exp": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} ** ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "signextend": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack[0] !== undefined && getStack[1] !== undefined) {
          newStack = `[signextend[${getStack[0]}]${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        } else {
          newStack = `[undefined${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "lt": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} < ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "slt": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} < ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "gt": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} > ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "sgt": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} > ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "eq": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} == ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "iszero": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length <= 1) {
          newStack = `[(${getStack[0]} == 0)]`;
        } else {
          newStack = `[(${getStack[0]} == 0), ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "and": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} & ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "or": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} | ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "xor": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} ^ ${getStack[1]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "not": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length <= 1) {
          newStack = `[~${getStack[0]}]`;
        } else {
          newStack = `[~${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "byte": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack[0] !== undefined && getStack[1] !== undefined) {
          newStack = `[byte[${getStack[0]}]${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        } else {
          newStack = `[undefined${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "shl": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[1]} << ${getStack[0]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "shr": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[1]} >> ${getStack[0]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "sar": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[1]} >> ${getStack[0]})${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "sha3": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack[0] !== undefined && getStack[1] !== undefined) {
          newStack = `[hash${getStack.length > 2 ? "," + getStack[2] : ""}]`;
        } else {
          newStack = `[undefined${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "address": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[address]`;
        } else if (getStack.length === 1) {
          newStack = `[address, ${getStack[0]}]`;
        } else {
          newStack = `[address, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "balance": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[undefined]`;
        } else if (getStack.length === 1) {
          newStack = `[balance]`;
        } else {
          newStack = `[balance, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "origin": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[originAddr]`;
        } else if (getStack.length === 1) {
          newStack = `[originAddr, ${getStack[0]}]`;
        } else {
          newStack = `[originAddr, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "caller": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[msg.sender]`;
        } else if (getStack.length === 1) {
          newStack = `[msg.sender, ${getStack[0]}]`;
        } else {
          newStack = `[msg.sender, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "callvalue": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[value]`;
        } else if (getStack.length === 1) {
          newStack = `[value, ${getStack[0]}]`;
        } else {
          newStack = `[value, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "calldataload": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length <= 1) {
          newStack = `[data[${getStack[0]}]]`;
        } else {
          newStack = `[data[${getStack[0]}], ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "calldatasize": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[size]`;
        } else if (getStack.length === 1) {
          newStack = `[size, ${getStack[0]}]`;
        } else {
          newStack = `[size, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "calldatacopy": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length < 3) {
          newStack = "[undefined]";
        } else {
          getStack = this.getStack(`[${getStack[2].trim()}]`);

          if (getStack.length === 1) {
            newStack = "[]";
          } else {
            newStack = `[${getStack[1]}${
              getStack.length > 2 ? "," + getStack[2] : ""
            }]`;
          }
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "codecopy": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length < 3) {
          newStack = "[undefined]";
        } else {
          getStack = this.getStack(`[${getStack[2].trim()}]`);

          if (getStack.length === 1) {
            newStack = "[]";
          } else {
            newStack = `[${getStack[1]}${
              getStack.length > 2 ? "," + getStack[2] : ""
            }]`;
          }
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "returndatacopy": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length < 3) {
          newStack = "[undefined]";
        } else {
          getStack = this.getStack(`[${getStack[2].trim()}]`);

          if (getStack.length === 1) {
            newStack = "[]";
          } else {
            newStack = `[${getStack[1]}${
              getStack.length > 2 ? "," + getStack[2] : ""
            }]`;
          }
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "codesize": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[size]`;
        } else if (getStack.length === 1) {
          newStack = `[size, ${getStack[0]}]`;
        } else {
          newStack = `[size, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "gasprice": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[gasPrice]`;
        } else if (getStack.length === 1) {
          newStack = `[gasPrice, ${getStack[0]}]`;
        } else {
          newStack = `[gasPrice, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "extcodesize": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[extCodeSize]`;
        } else {
          newStack = `[extCodeSize, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "extcodecopy": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length < 3) {
          newStack = "[undefined]";
        } else {
          getStack = this.getStack(`[${getStack[2].trim()}]`);

          if (getStack.length < 2) {
            newStack = "[undefined]";
          } else if (getStack.length === 2) {
            newStack = "[]";
          } else {
            newStack = `[${getStack[2].trim()}]`;
          }
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "returndatasize": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[returnDataSize]`;
        } else if (getStack.length === 1) {
          newStack = `[returnDataSize, ${getStack[0]}]`;
        } else {
          newStack = `[returnDataSize, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "extcodehash": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[extCodeHash]`;
        } else {
          newStack = `[extCodeHash, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "blockhash": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[blockHash]`;
        } else {
          newStack = `[blockHash, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "coinbase": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[coinbaseAddr]`;
        } else if (getStack.length === 1) {
          newStack = `[coinbaseAddr, ${getStack[0]}]`;
        } else {
          newStack = `[coinbaseAddr, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "timestamp": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[timestamp]`;
        } else if (getStack.length === 1) {
          newStack = `[timestamp, ${getStack[0]}]`;
        } else {
          newStack = `[timestamp, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "number": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[blockNumber]`;
        } else if (getStack.length === 1) {
          newStack = `[blockNumber, ${getStack[0]}]`;
        } else {
          newStack = `[blockNumber, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "prevrandao": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[prevRandao]`;
        } else if (getStack.length === 1) {
          newStack = `[prevRandao, ${getStack[0]}]`;
        } else {
          newStack = `[prevRandao, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "gaslimit": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[gasLimit]`;
        } else if (getStack.length === 1) {
          newStack = `[gasLimit, ${getStack[0]}]`;
        } else {
          newStack = `[gasLimit, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "chainid": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[chainId]`;
        } else if (getStack.length === 1) {
          newStack = `[chainId, ${getStack[0]}]`;
        } else {
          newStack = `[chainId, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "selfbalance": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[balance]`;
        } else if (getStack.length === 1) {
          newStack = `[balance, ${getStack[0]}]`;
        } else {
          newStack = `[balance, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "basefee": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[baseFee]`;
        } else if (getStack.length === 1) {
          newStack = `[baseFee, ${getStack[0]}]`;
        } else {
          newStack = `[baseFee, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "pop": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "mload": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length <= 1) {
          newStack = `[mload[${getStack[0]}]]`;
        } else {
          newStack = `[mload[${getStack[0]}], ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "mstore": {
        let getStack = this.getStack(stack);
        let newStack;
        if (getStack.length < 2) {
          newStack = "[undefined]";
        } else if (getStack.length === 2) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[2].trim()}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "mstore8": {
        let getStack = this.getStack(stack);
        let newStack;
        if (getStack.length < 2) {
          newStack = "[undefined]";
        } else if (getStack.length === 2) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[2].trim()}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "sstore": {
        let getStack = this.getStack(stack);
        let newStack;
        if (getStack.length < 2) {
          newStack = "[undefined]";
        } else if (getStack.length === 2) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[2].trim()}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "jumpi": {
        let getStack = this.getStack(stack);
        let newStack;
        if (getStack.length < 2) {
          newStack = "[undefined]";
        } else if (getStack.length === 2) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[2].trim()}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "sload": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length <= 1) {
          newStack = `[sload[${getStack[0]}]]`;
        } else {
          newStack = `[sload[${getStack[0]}], ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "jump": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "pc": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[counter]`;
        } else if (getStack.length === 1) {
          newStack = `[counter, ${getStack[0]}]`;
        } else {
          newStack = `[counter, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "msize": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[msize]`;
        } else if (getStack.length === 1) {
          newStack = `[msize, ${getStack[0]}]`;
        } else {
          newStack = `[msize, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "gas": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[gas]`;
        } else if (getStack.length === 1) {
          newStack = `[gas, ${getStack[0]}]`;
        } else {
          newStack = `[gas, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "push0": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[0x00]`;
        } else if (getStack.length === 1) {
          newStack = `[0x00, ${getStack[0]}]`;
        } else {
          newStack = `[0x00, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "push": {
        let getStack = this.getStack(stack);
        let newStack;
        tempOpcode = tempOpcode.length > 66 ? "undefined" : tempOpcode;

        if (getStack.length === 0) {
          newStack = `[${tempOpcode}]`;
        } else if (getStack.length === 1) {
          newStack = `[${tempOpcode}, ${getStack[0]}]`;
        } else {
          newStack = `[${tempOpcode}, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "dup": {
        let index = parseInt(tempOpcode.slice(3)) - 1;
        let stackString = stack.slice(1, -1);
        let stackArr = this.filterStack(stackString.split(","));
        let newStack;

        if (index <= stackArr.length - 1) {
          newStack = `[${stackArr[index].trim()}, ${stackString}]`;
        } else {
          newStack = `[${
            stackArr.length === 0 ? "undefined" : `undefined, ${stackString}`
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "swap": {
        let index = parseInt(tempOpcode.slice(4));
        let stackString = stack.slice(1, -1);
        let stackArr = stackString.split(",");

        if (index < stackArr.length) {
          [stackArr[0], stackArr[index]] = [
            stackArr[index].trim(),
            ` ${stackArr[0]}`,
          ];
        } else {
          stackArr[0] = "undefined";
        }
        let newStack = `[${stackArr.slice(0).map((item) => {
          return `${item}`;
        })}]`;

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "log": {
        let index = parseInt(tempOpcode.slice(3));
        let stackString = stack.slice(1, -1);
        let stackArr = this.filterStack(stackString.split(","));
        let newStack;

        if (index === stackArr.length - 2) {
          newStack = `[]`;
        } else if (index <= stackArr.length - 2) {
          newStack = stackArr.slice(index + 2).map((item) => {
            return ` ${item}`;
          });
          newStack = `[${newStack.toString().trim()}]`;
        } else {
          newStack = `[undefined]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "create": {
        let stackString = stack.slice(1, -1);
        let stackArr = this.filterStack(stackString.split(","));
        let newStack;

        if (stackArr.length < 3) {
          newStack = `[undefined]`;
        } else {
          newStack = `[address,${stackArr.slice(3).map((item) => {
            return ` ${item}`;
          })}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "call": {
        let stackString = stack.slice(1, -1);
        let stackArr = this.filterStack(stackString.split(","));
        let newStack;

        if (stackArr.length < 7) {
          newStack = `[undefined]`;
        } else {
          newStack = `[success,${stackArr.slice(7).map((item) => {
            return ` ${item}`;
          })}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "callcode": {
        let stackString = stack.slice(1, -1);
        let stackArr = this.filterStack(stackString.split(","));

        if (stackArr.length < 7) {
          return `[undefined]`;
        } else {
          return `[success,${stackArr.slice(7).map((item) => {
            return ` ${item}`;
          })}]`;
        }
      }
      case "return": {
        let getStack = this.getStack(stack);
        let newStack;
        if (getStack.length < 2) {
          newStack = "[undefined]";
        } else if (getStack.length === 2) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[2].trim()}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "delegatecall": {
        let stackString = stack.slice(1, -1);
        let stackArr = this.filterStack(stackString.split(","));
        let newStack;

        if (stackArr.length < 6) {
          newStack = `[undefined]`;
        } else {
          newStack = `[success,${stackArr.slice(6).map((item) => {
            return ` ${item}`;
          })}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "create2": {
        let stackString = stack.slice(1, -1);
        let stackArr = this.filterStack(stackString.split(","));
        let newStack;

        if (stackArr.length < 4) {
          newStack = `[undefined]`;
        } else {
          newStack = `[address,${stackArr.slice(4).map((item) => {
            return ` ${item}`;
          })}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "staticcall": {
        let stackString = stack.slice(1, -1);
        let stackArr = this.filterStack(stackString.split(","));
        let newStack;

        if (stackArr.length < 6) {
          newStack = `[undefined]`;
        } else {
          newStack = `[success,${stackArr.slice(6).map((item) => {
            return ` ${item}`;
          })}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "revert": {
        let getStack = this.getStack(stack);
        let newStack;
        if (getStack.length < 2) {
          newStack = "[undefined]";
        } else if (getStack.length === 2) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[2].trim()}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "selfdestruct": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "macrofunction": {
        let takesAmount = 0;
        let returnsAmount = 0;

        if (vscode.window.activeTextEditor) {
          const doc = vscode.window.activeTextEditor.document;
          let lineCount = doc.lineCount;
          let macroName = tempOpcode.slice(0, tempOpcode.indexOf("("));

          for (let i = 0; i < lineCount; i++) {
            let text: string = doc.lineAt(i).text.toString();

            if (
              text.includes(macroName) &&
              text.includes("#define") &&
              (text.includes("macro") || text.includes("function"))
            ) {
              let takesIndex = text.indexOf("takes");
              let returnsIndex = text.indexOf("returns");

              if (takesIndex >= 0) {
                takesAmount = parseInt(
                  text.slice(
                    text.indexOf("(", takesIndex) + 1,
                    text.indexOf(")", takesIndex),
                  ),
                );
              }

              if (returnsIndex >= 0) {
                returnsAmount = parseInt(
                  text.slice(
                    text.indexOf("(", returnsIndex) + 1,
                    text.indexOf(")", returnsIndex),
                  ),
                );
              }

              break;
            }
          }
        }

        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length < takesAmount) {
          newStack = `[undefined]`;
        } else {
          let tempStack = getStack.slice(takesAmount);
          for (let i = 0; i < returnsAmount; i++) {
            tempStack.unshift(`retData${i + 1}`);
          }

          newStack = tempStack.map((item) => {
            return ` ${item}`;
          });

          newStack = `[${newStack.toString().trim()}]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      case "builtin": {
        let arg = tempOpcode.split("(")[1].slice(0, -1);
        let item;

        if (tempOpcode.includes("FUNC_SIG(")) {
          item = `func_sig(${arg})`;
        } else if (tempOpcode.includes("EVENT_HASH(")) {
          item = `event_sig(${arg})`;
        } else if (tempOpcode.includes("ERROR(")) {
          item = `error_sig(${arg})`;
        } else if (tempOpcode.includes("RIGHTPAD(")) {
          item = `func_sig(${arg})`;
        } else if (tempOpcode.includes("codesize(")) {
          item = `code_size(${arg})`;
        } else if (tempOpcode.includes("tablestart(")) {
          item = `table_start`;
        } else if (tempOpcode.includes("tablesize(")) {
          item = `table_size`;
        }

        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${item}]`;
        } else if (getStack.length === 1) {
          newStack = `[${item}, ${getStack[0]}]`;
        } else {
          newStack = `[${item}, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        newStack = this.checkUndefined(newStack);

        return newStack;
      }
      default: {
        let getStack = stack.slice(1, -1);
        let getLen = this.filterStack(stack.slice(1, -1).split(",")).length;

        let newStack = `[${tempOpcode}${getLen > 0 ? ", " + getStack : ""}]`;
        return newStack;
      }
    }
  }
}
