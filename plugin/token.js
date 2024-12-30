class TokenService {
    constructor() {
        this.userTokens = new Map(); // Store user tokens in memory (for simplicity)
    }

    generateTokens(userId, amount) {
        if (!this.userTokens.has(userId)) {
            this.userTokens.set(userId, 0);
        }
        const currentTokens = this.userTokens.get(userId);
        this.userTokens.set(userId, currentTokens + amount);
        return this.userTokens.get(userId);
    }

    spendTokens(userId, amount) {
        if (!this.userTokens.has(userId)) {
            throw new Error('User does not have any tokens');
        }
        const currentTokens = this.userTokens.get(userId);
        if (currentTokens < amount) {
            throw new Error('Insufficient tokens');
        }
        this.userTokens.set(userId, currentTokens - amount);
        return this.userTokens.get(userId);
    }

    getTokenBalance(userId) {
        return this.userTokens.get(userId) || 0;
    }
}

module.exports = TokenService;