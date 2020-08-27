$(function() {
    consoleInit();
    start(main);
});

async function main() {
    print_warning();

    const App = await init_ethers();

    const stakingTokenAddr = MKR_TOKEN_ADDR;
    const stakingTokenTicker = "MKR";
    const rewardPoolAddr = MKR_REWARD_ADDR;
    const rewardTokenAddr = DEGEN_TOKEN_ADDR;
    const rewardTokenTicker = "DEGEN";
    const prices = await lookUpPrices(["maker"]);
    const stakingTokenPrice = prices["maker"].usd;
    const rewardTokenPrice = await getDEGENPrice(App);

    // DO NOT CHANGE BELOW

    _print(`Initialized ${App.YOUR_ADDRESS}`);
    _print("Reading smart contracts...\n");
    _print(`${rewardTokenTicker} Address: ${rewardTokenAddr}`);
    _print(`Reward Pool Address: ${rewardPoolAddr}\n`);

    const P_STAKING_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, App.provider);
    const STAKING_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, App.provider);

    const stakedAmount = await P_STAKING_POOL.balanceOf(App.YOUR_ADDRESS) / 1e18;
    const earned = await P_STAKING_POOL.earned(App.YOUR_ADDRESS) / 1e18;
    const stakingTokenTotalSupply = await STAKING_TOKEN.totalSupply() / 1e18;
    const totalStakedAmount = await STAKING_TOKEN.balanceOf(rewardPoolAddr) / 1e18;

    // Find out reward rate
    const weekly_reward = await get_synth_weekly_rewards(P_STAKING_POOL) / 1e18;

    const rewardPerToken = weekly_reward / totalStakedAmount;

    // Find out underlying assets of Y
    const unstakedAmount = await STAKING_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;

    _print("========== PRICES ==========")
    _print(`1 ${rewardTokenTicker}  = $${rewardTokenPrice}`);
    _print(`1 ${stakingTokenTicker}  = $${stakingTokenPrice}\n`);
   _print("============== STAKING ==============")
   _print(`There are total   : ${stakingTokenTotalSupply} ${stakingTokenTicker}.`);
   _print(`There are total   : ${totalStakedAmount} ${stakingTokenTicker} staked in ${rewardTokenTicker}'s ${stakingTokenTicker} staking pool.`);
   _print(`                  = ${toDollar(totalStakedAmount * stakingTokenPrice)}\n`);
   _print(`You are staking   : ${stakedAmount} ${stakingTokenTicker} (${toFixed(stakedAmount * 100 / totalStakedAmount, 3)}% of the pool)`);
   _print(`                  = ${toDollar(stakedAmount * stakingTokenPrice)}\n`);
   _print(`\n======== 🍝 ${rewardTokenTicker} REWARDS 🍝 ========`)
   _print(`Claimable Rewards : ${toFixed(earned, 4)} ${rewardTokenTicker} = $${toFixed(earned * rewardTokenPrice, 2)}`);
   const WeeklyEstimate = rewardPerToken * stakedAmount;
   _print(`Hourly estimate   : ${toFixed(WeeklyEstimate / (24 * 7), 4)} ${rewardTokenTicker} = ${toDollar((WeeklyEstimate / (24 * 7)) * rewardTokenPrice)} (out of total ${toFixed(weekly_reward / (7 * 24), 2)} ${rewardTokenTicker})`)
   _print(`Daily estimate    : ${toFixed(WeeklyEstimate / 7, 2)} ${rewardTokenTicker} = ${toDollar((WeeklyEstimate / 7) * rewardTokenPrice)} (out of total ${toFixed(weekly_reward / 7, 2)} ${rewardTokenTicker})`)
   _print(`Weekly estimate   : ${toFixed(WeeklyEstimate, 2)} ${rewardTokenTicker} = ${toDollar(WeeklyEstimate * rewardTokenPrice)} (out of total ${weekly_reward} ${rewardTokenTicker})`)
   const WeeklyROI = (rewardPerToken * rewardTokenPrice) * 100 / (stakingTokenPrice);

   _print(`\nHourly ROI in USD : ${toFixed((WeeklyROI / 7) / 24, 4)}%`)
   _print(`Daily ROI in USD  : ${toFixed(WeeklyROI / 7, 4)}%`)
   _print(`Weekly ROI in USD : ${toFixed(WeeklyROI, 4)}%`)
   _print(`APY (unstable)    : ${toFixed(WeeklyROI * 52, 4)}% \n`)

    const startTime = await getPeriodStartForReward(P_STAKING_POOL);
    const endTime = await getPeriodFinishForReward(P_STAKING_POOL);
    if (startTime > (Date.now() / 1000)) {
       _print(`Reward starting   : in ${forHumans(startTime - (Date.now() / 1000))} \n`);
    } else {
       _print(`Reward ending     : in ${forHumans(endTime - (Date.now() / 1000))} \n`);
    }

    const approveTENDAndStake = async function () {
        return rewardsContract_stake(stakingTokenAddr, rewardPoolAddr, App);
    };

    const unstake = async function() {
        return rewardsContract_unstake(rewardPoolAddr, App);
    };

    const claim = async function() {
        return rewardsContract_claim(rewardPoolAddr, App);
    };

    const exit = async function() {
        return rewardsContract_exit(rewardPoolAddr, App);
    };

    _print_link(`Stake ${unstakedAmount} ${stakingTokenTicker}`, approveTENDAndStake);
    _print_link(`Unstake ${stakedAmount} ${stakingTokenTicker}`, unstake);
    _print_link(`Claim ${earned} ${rewardTokenTicker}`, claim);
    _print_link(`Exit`, exit);

    hideLoading();
}
