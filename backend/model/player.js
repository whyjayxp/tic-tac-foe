module.exports = class Player {
    constructor(options) {
        // { socket, username }
        this.socket = options.socket;
        this.username = options.username;
        this.symbol = '';
        this.wins = 0;
        //this.powerups = [];
        this.curses = -1;
        this.skips = 0;
    }

    setSymbol(sym) {
        this.symbol = sym;
    }

    setCurse(cursedBy) {
        this.curses = cursedBy;
    }

    removeCurse() {
        var cursedBy = this.curses;
        this.curses = -1;
        return cursedBy;
    }

    checkCurse() {
        return this.curses != -1;
    }

    addSkip() {
        this.skips = this.skips + 1;
    }

    removeSkip() {
        if (this.skips > 0) this.skips = this.skips - 1;
    }

    checkSkip() {
        return this.skips > 0;
    }

    // addPowerup(pup) {
    //     this.powerups.push(pup);
    // }

    // usePowerup(idx) {
    //     var pup = this.powerups[idx];
    //     this.powerups.splice(pup, 1);
    //     return pup;
    // }
    
    // getPowerups() {
    //     return this.powerups;
    // }

    addWin() {
        this.wins = this.wins + 1;
        return this.wins;
    }
};