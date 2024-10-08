import { SimpleCommand, Notifier } from '@puremvc/puremvc-js-multicore-framework';

/*
 PureMVC MultiCore Utility for JS - AsyncCommand
 Copyright(c) 2008 Duncan Hall <duncan.hall@puremvc.org>
              2024 Cliff Hall <cliff.hall@puremvc.org>
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * A base IAsyncCommand implementation.
 *
 * Your subclass should override the `execute`
 * method where your business logic will handle the <code>Notification</code>. </P>
 *
 * @see AsyncMacroCommand
 */
class AsyncCommand extends SimpleCommand {

    /**
     * Registers the callback for a parent <code>AsyncMacroCommand</code>.
     *
     * @param callback	The <code>AsyncMacroCommand</code> method to call on completion
     */
    setOnComplete ( callback )
    {
        this.onComplete = callback;
    }

    /**
     * Notify the parent AsyncMacroCommand that this command is complete.
     *
     * Call this method from your subclass to signify that your asynchronous
     * command has finished.
     */
    commandComplete()
    {
        this.onComplete();
    }

    onComplete;     // the callback to invoke on command completion
    isAsync = true; // simplest workaround to lack of interfaces
}

/*
 PureMVC MultiCore Utility for JS - AsyncCommand
 Copyright(c) 2008 Duncan Hall <duncan.hall@puremvc.org>
              2024 Cliff Hall <cliff.hall@puremvc.org>
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * A base Command implementation that executes other
 * Commands asynchronously.
 
 * An AsyncMacroCommand maintains a list of
 * factories that create SubCommands.
 
 * When execute is called, the AsyncMacroCommand
 * caches a reference to the Notification and calls
 * nextCommand.
 
 * If there are still SubCommands to be executed,
 * the nextCommand method instantiates and calls
 * execute on each of its SubCommands in turn.
 *
 * Each SubCommand will be passed a reference to the
 * original Notification that was passed to the
 * AsyncMacroCommand's execute method. If the
 * SubCommand to execute is an IAsyncCommand, the
 * next SubCommand will not be executed until the
 * previousAsyncCommand has called its commandComplete
 * method.
 
 * Unlike AsyncCommand and SimpleCommand, your subclass
 * should not override execute, but instead, should
 * override the initializeAsyncMacroCommand method,
 * calling addSubCommand once for each SubCommand
 * to be executed.
 *
 * @see AsyncCommand
 */
class AsyncMacroCommand extends Notifier
{

    /**
     * Constructor.
     
     * You should not need to define a constructor,
     * instead, override the initializeAsyncMacroCommand
     * method.
     
     * If your subclass does define a constructor, be
     * sure to call super().
     */
    constructor()
    {
        super();
        this.subCommands = [];
        this.initializeAsyncMacroCommand();
    }

    /**
     * Initialize the AsyncMacroCommand.
     *
     * In your subclass, override this method to
     * initialize the AsyncMacroCommand's SubCommand
     * list with factories like this:
     *
     *		// Initialize MyMacroCommand
     *		function initializeAsyncMacroCommand()
     *		{
     *			addSubCommand( () => new FirstCommand );
     *			addSubCommand( () => new SecondCommand );
     *			addSubCommand( () => new ThirdCommand );
     *		}
     *
     * SubCommands should extend one of the following
     * - AsyncMacroCommand
     * - AsyncCommand
     * - MacroCommand 
     * - SimpleCommand
     */
    initializeAsyncMacroCommand(){}

    /**
     * Add a SubCommand.
     *
     * The SubCommands will be called in First In/First Out (FIFO)
     * order.
     *
     * @param factory a function that instantiates the subcommand
     */
    addSubCommand( factory ) { this.subCommands.push( factory );}

    /**
     * Registers the callback for a parent AsyncMacroCommand.
     *
     * @param callback	The AsyncMacroCommand method to call on completion
     */
    setOnComplete ( callback ) { this.onComplete = callback; }

    /**
     * Starts execution of this AsyncMacroCommand's SubCommands.
     *
     * The SubCommands will be called in First In/First Out (FIFO) order.
     *
     * @param notification the Notification object to be passed to each SubCommand.
     */
    execute( notification )
    {
        this.note = notification;
        this.nextCommand();
    }

    /**
     * Execute this AsyncMacroCommand's next SubCommand.
     *
     * If the next SubCommand is asynchronous, a callback is registered for
     * the command completion, else the next command is run.
     */
    nextCommand()
    {
        if (this.subCommands?.length > 0)
        {
            const factory = this.subCommands.shift();
            const instance	= factory();
            let isAsync	= ( instance?.isAsync === true );
            if (isAsync) instance.setOnComplete( () => this.nextCommand() );
            instance.initializeNotifier( this.multitonKey );
            instance.execute( this.note );
            if (!isAsync) this.nextCommand();
        } else {
            if( this?.onComplete ) this.onComplete();
            this.note = null;
            this.onComplete	= null;
        }
    }

    note;           // Notification
    subCommands;    // Array of command subcommand factories
    onComplete;     // Optional function to call when the AsyncMacro completes
    isAsync = true; // simplest workaround to lack of interfaces
}

export { AsyncCommand, AsyncMacroCommand };
