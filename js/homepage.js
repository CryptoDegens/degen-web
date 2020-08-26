$(function() {
    consoleInit();
    start(main);
});

async function main() {
    const App = await init_ethers();

    // TOKENS
    const DEGEN = new ethers.Contract(DEGEN_TOKEN_ADDR, ERC20_ABI, App.provider);

    const WETH = new ethers.Contract(WETH_TOKEN_ADDR, ERC20_ABI, App.provider);
    const WBTC = new ethers.Contract(WBTC_TOKEN_ADDR, ERC20_ABI, App.provider);
    const COMP = new ethers.Contract(COMP_TOKEN_ADDR, ERC20_ABI, App.provider);
    const SNX = new ethers.Contract(SNX_TOKEN_ADDR, ERC20_ABI, App.provider);
    const MKR = new ethers.Contract(MKR_TOKEN_ADDR, ERC20_ABI, App.provider);
    const LEND = new ethers.Contract(LEND_TOKEN_ADDR, ERC20_ABI, App.provider);
    const YYCRV = new ethers.Contract(YYCRV_TOKEN_ADDR, ERC20_ABI, App.provider);
    const YALINK = new ethers.Contract(YALINK_TOKEN_ADDR, ERC20_ABI, App.provider);
    const YYFI = new ethers.Contract(YYFI_TOKEN_ADDR, ERC20_ABI, App.provider);
    const YUSDC = new ethers.Contract(YUSDC_TOKEN_ADDR, ERC20_ABI, App.provider);

    // STAKING POOLS
    const wethStaked = await WETH.balanceOf(WETH_REWARD_ADDR) / 1e18;
    const wbtcStaked = await WBTC.balanceOf(WBTC_REWARD_ADDR) / 1e8;
    const compStaked = await COMP.balanceOf(COMP_REWARD_ADDR) / 1e18;
    const snxStaked = await SNX.balanceOf(SNX_REWARD_ADDR) / 1e18;
    const mkrStaked = await MKR.balanceOf(MKR_REWARD_ADDR) / 1e18;
    const lendStaked = await LEND.balanceOf(LEND_REWARD_ADDR) / 1e18;
    const yycrvStaked = await YYCRV.balanceOf(YYCRV_REWARD_ADDR) / 1e18;
    const yalinkStaked = await YALINK.balanceOf(YALINK_REWARD_ADDR) / 1e18;
    const yyfiStaked = await YYFI.balanceOf(YYFI_REWARD_ADDR) / 1e18;
    const yusdcStaked = await YUSDC.balanceOf(YUSDC_REWARD_ADDR) / 1e18;

    // PRICES
    const prices = await lookUpPrices(["ethereum", "maker", "wrapped-bitcoin", "ethlend", "havven", "compound-governance-token"]);
    const yycrvPrice = await getYYCRVPrice(App)
    const yalinkPrice = await getYALINKVPrice(App)
    const yyfiPrice = await getYYFIVPrice(App)
    const yusdcPrice = await getYUSDCVPrice(App)

    _print(`WETH locked = ${toDollar(wethStaked * prices["ethereum"].usd)}\n`);
    _print(`WBTC locked = ${toDollar(wbtcStaked * prices["wrapped-bitcoin"].usd)}\n`);
    _print(`COMP locked = ${toDollar(compStaked * prices["compound-governance-token"].usd)}\n`);
    _print(`SNX locked  = ${toDollar(snxStaked * prices["havven"].usd)}\n`);
    _print(`MKR locked  = ${toDollar(mkrStaked * prices["maker"].usd)}\n`);
    _print(`LEND locked = ${toDollar(lendStaked * prices["ethlend"].usd)}\n`);
    _print(`YYCRV locked = ${toDollar(yycrvStaked * yycrvPrice)}\n`);
    _print(`YALINK locked = ${toDollar(yalinkStaked * yalinkPrice)}\n`);
    _print(`YYFI locked = ${toDollar(yyfiStaked * yyfiPrice)}\n`);
    _print(`YUSDC locked = ${toDollar(yusdcStaked * yusdcPrice)}\n`);

    _print(`TOTAL       = ${toDollar(wethStaked * prices["ethereum"].usd
                            + wbtcStaked * prices["wrapped-bitcoin"].usd
                            + compStaked * prices["compound-governance-token"].usd
                            + snxStaked * prices["havven"].usd
                            + mkrStaked * prices["maker"].usd
                            + lendStaked * prices["ethlend"].usd
                            + yycrvStaked * yycrvPrice
                            + yalinkStaked * yalinkPrice
                            + yyfiStaked * yyfiPrice
                            + yusdcStaked * yusdcPrice
                          )}\n`);

    _print(`\n\nTOTAL DEGENS = ${await DEGEN.totalSupply() / 1e18}`);

};
