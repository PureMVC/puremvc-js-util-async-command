/*
 PureMVC MultiCore Utility for JS - AsyncCommand
 Copyright(c) 2008 Duncan Hall <duncan.hall@puremvc.org>
              2024 Cliff Hall <cliff.hall@puremvc.org>
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
import { SimpleCommand } from "@puremvc/puremvc-js-multicore-framework";

/**
 * A base IAsyncCommand implementation.
 *
 * Your subclass should override the `execute`
 * method where your business logic will handle the <code>Notification</code>. </P>
 *
 * @see AsyncMacroCommand
 */
export class AsyncCommand extends SimpleCommand {
  /**
   * Registers the callback for a parent <code>AsyncMacroCommand</code>.
   *
   * @param callback	The <code>AsyncMacroCommand</code> method to call on completion
   */
  setOnComplete(callback) {
    this.onComplete = callback;
  }

  /**
   * Notify the parent AsyncMacroCommand that this command is complete.
   *
   * Call this method from your subclass to signify that your asynchronous
   * command has finished.
   */
  commandComplete() {
    this.onComplete();
  }

  onComplete; // the callback to invoke on command completion
  isAsync = true; // simplest workaround to lack of interfaces
}
