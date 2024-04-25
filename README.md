# 🍝 Stack-Pasta 🍝

This VScode extension makes life eaiser for HUFFOOOORS, as it copies and updates previous stack comment and paste in the next line (pasta 🍝). 

## How To Use

Search for "Stack Pasta" on VSCode, install and start Huffing.

## Features

Hitting Enter ⏎ on your keyboard after each opcode does the magic.


![stack_pasta](https://github.com/tanim0la/stack-pasta/assets/36541366/4b42d95c-a7c2-4b16-916f-f6db70f42f6d)



## Requirements

1. Make sure to write one opcode per line as in the demo above.



## Versions

### 0.2.2

Added reverse stack feature for those that adds stack item at the right most position in the stack

#### How to enable:
    vscode.settings > Extentions > StackPasta > Check the box to enable reverved stack

### 0.2.3

Stack pasta bug fix (`log` opcode)

### 0.2.4
Added support for:
- `stop` opcode
- Builtin functions like __FUNC_SIG() 
- Infile macros and functions

