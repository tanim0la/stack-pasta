// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "stacker" is now active!');

  let prevLineCount: number = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.document.lineCount
    : 0;

  vscode.window.onDidChangeTextEditorSelection(async (onChange) => {
    const editor = onChange.textEditor;
    // editor.
    const document = onChange.textEditor.document;
    const documentExt = document.uri.toString().slice(-5);
    // console.log("here");
    if (
      onChange.kind === undefined &&
      documentExt === ".huff" &&
      prevLineCount < editor.document.lineCount
    ) {
      //   console.log("here2");

      // The primary selection on the text editor
      const selection = editor.selection;
      // Get the position of the cursor
      let cursorIndex = selection.anchor.line;

      // Get the text on the cursor index
      let cursorIndexText = document.lineAt(
        cursorIndex > 0 ? cursorIndex - 1 : cursorIndex,
      ).text;

      console.log(cursorIndexText);
      console.log(cursorIndexText.toString().split("//"));

      let lineArr = cursorIndexText.toString().split("//");
      let firstItem = lineArr[0].trim().split(" ");
      console.log(firstItem);

      if (
        lineArr.length === 2 &&
        firstItem.length === 1 &&
        firstItem[0] !== ""
      ) {
        editor.edit((editBuilder) => {
          editBuilder.insert(selection.anchor, `    //${lineArr[1]}`);

          vscode.window.showTextDocument(document).then((editor) => {
            editor.selection = new vscode.Selection(
              new vscode.Position(
                selection.active.line,
                selection.active.character,
              ),
              new vscode.Position(
                selection.active.line,
                selection.active.character,
              ),
            );

            editor.revealRange(
              editor.selection,
              vscode.TextEditorRevealType.Default,
            );

            // console.log(editor.document.lineAt(selection.anchor.line).text);
            // console.log("tani");
          });
        });
      }
    }
    prevLineCount = editor.document.lineCount;
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  //   let disposable = vscode.commands.registerCommand("huff.stacker", async () => {
  // Get the active text editor
  // const editor = vscode.window.activeTextEditor;
  // if (editor) {
  //   // The document associated with the current text editor
  //   const document = editor.document;
  //   // Get document extenstion and assert it is a huff document
  //   const ducomentExt = document.uri.toString().slice(-5);
  //   if (ducomentExt === ".huff") {
  //     // The primary selection on the text editor
  //     const selection = editor.selection;
  //     // Get the position of the cursor
  //     let cursorIndex = selection.active.line;
  //     // Read document content
  //     let content = await vscode.workspace.fs.readFile(document.uri);
  //     // Get the text on the cursor index
  //     let cursorIndexText = content.toString().split("\n")[
  //       cursorIndex === 0 ? cursorIndex : cursorIndex - 1
  //     ];
  //     console.log(cursorIndexText);
  //     editor.edit((editBuilder) => {
  //       editBuilder.insert(selection.active, "\nhi from me");
  //     });
  //   }
  //   // Get the word within the selection
  //   // const word = document.getText(selection);
  //   // const reversed = word.split("").reverse().join("");
  //   // editor.edit((editBuilder) => {
  //   //   editBuilder.replace(selection, reversed);
  //   // });
  // }
  //   });
  //   context.extension.activate();
  //   context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
