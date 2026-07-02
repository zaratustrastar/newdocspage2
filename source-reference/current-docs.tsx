import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const LAST_UPDATED = "2026-05-18";

const VAULT_ADDRESS = "0xd1ccBc2Aa6e2f41817b62448089d4125E62df4fb";
const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const REPORT_SIGNER = "0x59D0461ec7C4688dd3DAab7Ea903d93d109dB9E0";
const ARB_SERVICER = "0xEdae94A822582324f19c89a057d694d833E6A6F0";
const FEE_RECIPIENT = "0x7C8d9ad4F51299b02755Ec13C018004008b45494";

type NavItem = { id: string; title: string };
type NavSection = { title: string; items: NavItem[] };
type DocPage = { title: string; related?: string[]; content: ReactNode };

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { id: "what-is-pmfi", title: "What is PMFI?" },
      { id: "parbitrage-vault", title: "pArbitrage Vault" },
      { id: "strategy-logic", title: "Strategy logic" },
      { id: "accounting-metrics", title: "Accounting & metrics" },
      { id: "user-flow", title: "User flow" },
      { id: "liquidity-management", title: "Liquidity management" },
    ],
  },
  {
    title: "Security & Risk",
    items: [
      { id: "risk-disclosure", title: "Risk disclosure" },
      { id: "risk-mitigation", title: "Risk mitigation" },
      { id: "contract-addresses", title: "Contract addresses" },
    ],
  },
  {
    title: "Updates",
    items: [{ id: "changelog", title: "Changelog" }],
  },
];

const navLookup = Object.fromEntries(
  navSections.flatMap((section) => section.items.map((item) => [item.id, item.title])),
);

function Callout({ children }: { children: ReactNode }) {
  return <div className="docs-callout">{children}</div>;
}

function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <pre className="docs-code-block">
      <code>{children}</code>
    </pre>
  );
}

function CopyAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <code>{value}</code>
      <button type="button" className="docs-copy-btn" onClick={copy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}

function RelatedPages({ related }: { related?: string[] }) {
  return null;
}

const docs: Record<string, DocPage> = {
  "what-is-pmfi": {
    title: "What is PMFI?",
    related: ["parbitrage-vault", "strategy-logic", "risk-disclosure", "contract-addresses"],
    content: (
      <>
        <p>PMFI is a protocol for automated prediction market vaults.</p>

        <p>
          The first PMFI product is the pArbitrage Vault, a USDC-denominated vault designed to execute
          prediction market arbitrage when predefined pricing and execution conditions are met.
        </p>

        <p>
          PMFI does not require users to manually monitor markets, place individual trades, or manage each
          position directly.
        </p>

        <h2 id="current-status">Current status</h2>

        <table>
          <thead>
            <tr><th>Item</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Network</td><td>Base</td></tr>
            <tr><td>Vault</td><td>pArbitrage Vault</td></tr>
            <tr><td>Vault token</td><td>pARB</td></tr>
            <tr><td>Deposit asset</td><td>USDC</td></tr>
            <tr><td>Audit status</td><td>Pending</td></tr>
          </tbody>
        </table>

        <Callout>PMFI is currently in beta. Vault performance is not guaranteed. Audit is pending.</Callout>
      </>
    ),
  },

  "parbitrage-vault": {
    title: "pArbitrage Vault",
    related: ["user-flow", "accounting-metrics", "risk-disclosure"],
    content: (
      <>
        <p>The pArbitrage Vault is an automated USDC vault for prediction market arbitrage.</p>

        <p>
          Users deposit USDC and receive pARB vault shares after their deposit request is processed by a vault report.
        </p>

        <p>
          The vault strategy searches for paired YES and NO exposure across supported prediction market venues.
          If pricing conditions are met, the strategy may open a paired position.
        </p>

        <h2 id="core-mechanism">Core mechanism</h2>

        <p>In binary prediction markets, YES + NO settle to $1 together.</p>

        <p>
          When the combined cost of YES + NO falls below $1 after fees and execution buffers, the vault can
          capture the spread.
        </p>

        <h2 id="what-users-hold">What users hold</h2>

        <p>Users hold pARB shares.</p>

        <p>
          Users do not directly hold or manage individual prediction market positions. The vault and offchain
          execution system manage strategy execution, accounting, and reporting.
        </p>

        <h2 id="contract-address">Contract address</h2>

        <table>
          <thead>
            <tr><th>Contract</th><th>Address</th></tr>
          </thead>
          <tbody>
            <tr><td>pArbitrage Vault V2</td><td><CopyAddress value={VAULT_ADDRESS} /></td></tr>
          </tbody>
        </table>

        <h2 id="important-note">Important note</h2>

        <p>The vault does not guarantee profit, APR, APY.</p>
      </>
    ),
  },

  "strategy-logic": {
    title: "Strategy logic",
    related: ["parbitrage-vault", "risk-mitigation", "risk-disclosure"],
    content: (
      <>
        <p>
          The pArbitrage strategy searches for paired YES and NO exposure across supported prediction market venues.
        </p>

        <h2 id="supported-venues">Supported venues</h2>

        <p>The strategy currently supports:</p>

        <table>
          <thead>
            <tr><th>Venue</th><th>Status</th><th>Used for</th></tr>
          </thead>
          <tbody>
            <tr><td>Polymarket</td><td>Supported</td><td>Market data and execution</td></tr>
            <tr><td>Kalshi</td><td>Supported</td><td>Market data and execution</td></tr>
            <tr><td>Opinion</td><td>Supported</td><td>Market data and execution</td></tr>
          </tbody>
        </table>

        <p>PMFI may add additional supported venues over time.</p>

        <p>
          Venue expansion depends on liquidity, API reliability, settlement process, execution quality, supported
          market structure, and operational risk.
        </p>

        <h2 id="venue-accounts">Venue accounts</h2>

        <p>
          PMFI provides public venue profiles where available so users can review account-level activity
          alongside live vault positions.
        </p>

        <table>
          <thead>
            <tr><th>Venue</th><th>Profile</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Polymarket</td>
              <td>
                <a href="https://polymarket.com/@pmfi3" target="_blank" rel="noopener noreferrer">
                  Open profile
                </a>
              </td>
              <td>Public PMFI Polymarket profile</td>
            </tr>
            <tr>
              <td>Opinion</td>
              <td>
                <a href="https://www.opinion.trade/profile?address=0x61068AbfB8349f90bd0bAb12347ec10e0C55C20f" target="_blank" rel="noopener noreferrer">
                  Open profile
                </a>
              </td>
              <td>Public PMFI Opinion profile</td>
            </tr>
            <tr>
              <td>Kalshi</td>
              <td>
                <a href="https://kalshi.com/ideas/profiles/pmfi" target="_blank" rel="noopener noreferrer">
                  Open profile
                </a>
              </td>
              <td>PMFI Kalshi profile</td>
            </tr>
          </tbody>
        </table>

        <h2 id="kalshi-trade-verification">Kalshi trade verification</h2>

        <p>
          Kalshi does not provide a fully public individual trading profile with complete net worth, ROI, or
          full transaction history.
        </p>

        <p>
          PMFI publishes live positions in the app. To verify a Kalshi-side execution, users can open the
          specific Kalshi market and review the market activity tab for recent executed trades around the
          displayed execution time and price.
        </p>

        <h2 id="market-pairing">Market pairing</h2>

        <p>
          The strategy first looks for equivalent or highly similar prediction markets across supported venues.
        </p>

        <p>
          A valid pair requires both markets to represent the same underlying event and compatible resolution logic.
        </p>

        <table>
          <thead>
            <tr><th>Leg</th><th>Venue</th><th>Exposure</th></tr>
          </thead>
          <tbody>
            <tr><td>Leg 1</td><td>Polymarket</td><td>YES or NO</td></tr>
            <tr><td>Leg 2</td><td>Kalshi / Opinion</td><td>Opposite side</td></tr>
          </tbody>
        </table>

        <p>The goal is to build paired YES + NO exposure across venues.</p>

        <p>
          The bot then checks whether the combined cost of both legs is below expected settlement value after
          fees, buffers, and execution checks.
        </p>

        <p>
          Not every similar-looking market is eligible. PMFI may skip markets if titles, rules, resolution
          criteria, expiry, liquidity, or venue conditions are not compatible.
        </p>

        <h2 id="core-arbitrage-condition">Core arbitrage condition</h2>

        <p>In a binary market:</p>

        <CodeBlock>YES + NO = $1.00 at settlement</CodeBlock>

        <p>A potential arbitrage exists when:</p>

        <CodeBlock>combined_cost_after_fees &lt; $1.00</CodeBlock>

        <p>Where:</p>

        <CodeBlock>{`combined_cost_after_fees =
  YES_entry_price
+ NO_entry_price
+ venue_fees
+ execution_buffer`}</CodeBlock>

        <p>The strategy should only execute when:</p>

        <CodeBlock>1.00 - combined_cost_after_fees &gt; required_edge</CodeBlock>

        <h2 id="vwap-check">VWAP check</h2>

        <p>VWAP means volume-weighted average price.</p>

        <p>
          It estimates the average price the bot would pay if it filled the target size across available order
          book liquidity.
        </p>

        <CodeBlock>VWAP = total_cost / filled_contracts</CodeBlock>

        <p>
          PMFI uses VWAP checks because the best visible price may only be available for a small size. A trade
          can look profitable at the top of the book but become unprofitable when filled across deeper liquidity.
        </p>

        <h2 id="valid-opportunity">Valid opportunity</h2>

        <table>
          <thead>
            <tr><th>Requirement</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td>Compatible paired exposure</td><td>YES and NO exposure must be compatible across paired markets.</td></tr>
            <tr><td>Combined cost</td><td>Combined cost must be below $1 after fees.</td></tr>
            <tr><td>Live liquidity</td><td>Supported venues must have sufficient executable depth.</td></tr>
            <tr><td>VWAP check</td><td>Matched-size VWAP must pass profitability checks.</td></tr>
            <tr><td>Safety buffer</td><td>Net edge must exceed required edge threshold.</td></tr>
            <tr><td>Capital limits</td><td>Per-pair and total deployed caps must be respected.</td></tr>
          </tbody>
        </table>

        <h2 id="execution-behavior">Execution behavior</h2>

        <p>If pricing is not favorable, the vault should not open the position.</p>

        <p>If pricing is favorable, the executor may attempt to open both legs.</p>

        <h2 id="failed-second-leg-handling">Failed second-leg handling</h2>

        <p>
          If the first leg executes and the second leg does not immediately fill, PMFI does not automatically
          unwind as the first action.
        </p>

        <p>The handling sequence is:</p>

        <ol>
          <li>Retry second-leg execution.</li>
          <li>Re-fetch the live order book.</li>
          <li>Check whether the second leg can still be filled while keeping the combined trade profitable.</li>
          <li>If the second leg is partially filled, attempt to complete the missing hedge.</li>
          <li>Use unwind only as a last-resort option if completing the hedge would no longer be profitable or safe.</li>
        </ol>

        <p>
          PMFI avoids unnecessary unwinds because unwinding can create extra fees, slippage, and execution loss.
        </p>

        <h2 id="execution-failure-cases">Execution failure cases</h2>

        <p>Execution may fail, partially fill, retry, reprice, hedge, unwind, or be skipped due to:</p>

        <ul>
          <li>insufficient live liquidity</li>
          <li>stale opportunity data</li>
          <li>VWAP edge below threshold</li>
          <li>price movement</li>
          <li>per-pair cap</li>
          <li>total deployed cap</li>
          <li>insufficient deployable capital</li>
        </ul>
      </>
    ),
  },

  "accounting-metrics": {
    title: "Accounting & metrics",
    related: ["user-flow", "liquidity-management", "risk-disclosure"],
    content: (
      <>
        <p>
          This page explains how PMFI handles vault accounting, PPS, deposits, redemptions, performance fees,
          TVL, APR, APY, and open pair data.
        </p>

        <Callout><strong>Estimate:</strong> APR and APY are estimates. Vault performance is not guaranteed.</Callout>

        <h2 id="precision">Precision</h2>

        <p>The contract uses:</p>

        <CodeBlock>NAV_PRECISION = 1e18</CodeBlock>

        <p>USDC uses 6 decimals. Base USDC is <CopyAddress value={BASE_USDC} />.</p>

        <p>The initial vault price is:</p>

        <CodeBlock>INITIAL_PPS = 1e6</CodeBlock>

        <p>This represents:</p>

        <CodeBlock>$1.00 per 1e18 pARB shares</CodeBlock>

        <h2 id="official-pps">Official PPS</h2>

        <p>The vault stores an official price per share:</p>

        <CodeBlock>officialPPS</CodeBlock>

        <p>It is updated only during a valid <code>report()</code>.</p>

        <h2 id="report-data">Report data</h2>

        <CodeBlock>{`struct ReportData {
    uint256 reportedAssets;
    uint256 timestamp;
    uint256 deadline;
    uint256 nonce;
}`}</CodeBlock>

        <p>The signed report includes:</p>

        <ul>
          <li>reportedAssets</li>
          <li>timestamp</li>
          <li>deadline</li>
          <li>nonce</li>
          <li>vault address</li>
          <li>chain ID</li>
          <li>domain salt</li>
        </ul>

        <h2 id="backing-assets">Backing assets</h2>

        <CodeBlock>{`deductions =
  totalPendingDepositAssets
+ totalClaimableRedeemAssets`}</CodeBlock>

        <CodeBlock>{`backingAssetsNow =
  reportedAssets > deductions
    ? reportedAssets - deductions
    : 0`}</CodeBlock>

        <h2 id="high-water-mark">High-water mark</h2>

        <p>The contract tracks:</p>

        <CodeBlock>highWaterMarkAssets</CodeBlock>

        <p>Profit above the high-water mark is calculated as:</p>

        <CodeBlock>{`profitAboveHWM =
  backingAssetsNow - highWaterMarkAssets`}</CodeBlock>

        <p>
          If <code>backingAssetsNow</code> is below the high-water mark, the value is negative and no performance
          fee is charged.
        </p>

        <h2 id="when-profit-is-recognized">When profit is recognized</h2>

        <p>
          For PMFI accounting, protocol profit is recognized when settled value is reflected in reported assets.
        </p>

        <p>
          The strategy may hold open paired positions before settlement. Expected edge may be visible in app
          metrics, but official protocol profit is only reflected when settlement proceeds or realized value are
          included in reported assets.
        </p>

        <p>Performance fees are not taken from unrealized expected edge.</p>

        <p>
          Performance fees are applied only when reported backing assets exceed the previous high-water mark.
        </p>

        <h2 id="performance-fee-model">Performance fee model</h2>

        <p>PMFI charges a 20% performance fee on profit above the high-water mark.</p>

        <p>The fee is not taken as a direct USDC transfer during normal reporting.</p>

        <p>Instead, the protocol mints new pARB shares to the fee recipient.</p>

        <p>This means the fee is paid through share dilution.</p>

        <CodeBlock>feeAssets = profitAboveHWM × PERF_FEE_BPS / 10,000</CodeBlock>

        <p><code>10,000</code> is the basis-points denominator.</p>

        <CodeBlock>{`100% = 10,000 bps
20% = 2,000 bps`}</CodeBlock>

        <p>And the contract uses:</p>

        <CodeBlock>PERF_FEE_BPS = 2000</CodeBlock>

        <p>The fee is:</p>

        <CodeBlock>feeAssets = profitAboveHWM × 2000 / 10000</CodeBlock>

        <p>Which equals:</p>

        <CodeBlock>20% of profit above the high-water mark</CodeBlock>

        <p>Fee shares are then minted:</p>

        <CodeBlock>{`feeShares =
  feeAssets × outstandingShares
  / (backingAssetsNow - feeAssets)`}</CodeBlock>

        <h2 id="new-official-pps">New official PPS</h2>

        <CodeBlock>{`netBacking =
  backingAssetsNow > feeAssets
    ? backingAssetsNow - feeAssets
    : backingAssetsNow`}</CodeBlock>

        <CodeBlock>{`newPPS =
  outstandingShares > 0
    ? netBacking × NAV_PRECISION / outstandingShares
    : INITIAL_PPS`}</CodeBlock>

        <p>If <code>newPPS == 0</code>, the contract sets:</p>

        <CodeBlock>newPPS = INITIAL_PPS</CodeBlock>

        <p>Then:</p>

        <CodeBlock>officialPPS = newPPS</CodeBlock>

        <h2 id="deposit-pricing">Deposit pricing</h2>

        <p>Deposits are processed at the higher of current PPS or the initial $1.00 PPS.</p>

        <CodeBlock>depositPPS = max(currentPPS, INITIAL_PPS)</CodeBlock>

        <p>This means users deposit at:</p>

        <ul>
          <li>$1.00 PPS if current PPS is below $1.00</li>
          <li>current PPS if current PPS is above $1.00</li>
        </ul>

        <p>Shares are minted as:</p>

        <CodeBlock>shares = depositAmount × NAV_PRECISION / depositPPS</CodeBlock>

        <p>This prevents below-$1 deposit entry and protects existing holders from dilution.</p>

        <h2 id="redemption-pricing">Redemption pricing</h2>

        <p>Redemptions use <code>officialPPS</code>.</p>

        <CodeBlock>lockedAssets = shares × officialPPS / NAV_PRECISION</CodeBlock>

        <h2 id="tvl">TVL</h2>

        <p>The app displays TVL from PMFI vault accounting data.</p>

        <CodeBlock>TVL = total_assets_usdc</CodeBlock>

        <p><code>total_assets_usdc</code> may include:</p>

        <ul>
          <li>USDC held in the vault</li>
          <li>USDC held by the servicer wallet</li>
          <li>USDC balances on supported venues</li>
          <li>value assigned to open positions</li>
          <li>settled proceeds awaiting transfer or reporting</li>
        </ul>

        <p>
          TVL combines vault contract state, onchain-verifiable balances, public venue positions where available,
          and PMFI-reported venue balances.
        </p>

        <p>
          Polymarket and Opinion activity can be reviewed through public venue profiles where available.
        </p>

        <p>
          Kalshi is an offchain regulated venue, so Kalshi balances and executions are reported by PMFI. Users
          can cross-check Kalshi-side execution against live PMFI positions and recent trade activity on the
          relevant Kalshi market.
        </p>

        <h2 id="apr">APR</h2>

        <CodeBlock>{`gross_return = expected_payout / cost_basis - 1

expected_payout = shares × 1.00

gross_return = shares / cost_basis_usdc - 1

APR = gross_return × (365 / days_to_settlement)

APR_pct = APR × 100`}</CodeBlock>

        <h2 id="apy">APY</h2>

        <CodeBlock>{`APY = (1 + gross_return) ^ (365 / days_to_settlement) - 1

APY_pct = APY × 100`}</CodeBlock>

        <h2 id="open-pairs">Open pairs</h2>

        <p>Open pairs are active paired positions held by the vault.</p>

        <table>
          <thead>
            <tr><th>Field</th><th>Meaning</th></tr>
          </thead>
          <tbody>
            <tr><td><code>pair_id</code></td><td>Internal market pair identifier</td></tr>
            <tr><td><code>shares</code></td><td>Number of contracts held</td></tr>
            <tr><td><code>poly_side</code></td><td>Polymarket side purchased</td></tr>
            <tr><td><code>poly_entry_price</code></td><td>Polymarket entry price</td></tr>
            <tr><td><code>kalshi_side</code></td><td>Kalshi side purchased, if applicable</td></tr>
            <tr><td><code>kalshi_entry_price</code></td><td>Kalshi entry price, if applicable</td></tr>
            <tr><td><code>opinion_side</code></td><td>Opinion side purchased, if applicable</td></tr>
            <tr><td><code>opinion_entry_price</code></td><td>Opinion entry price, if applicable</td></tr>
            <tr><td><code>cost_basis_usdc</code></td><td>Stored total cost basis</td></tr>
            <tr><td><code>expiry_ts</code></td><td>Expected settlement timestamp</td></tr>
            <tr><td><code>status</code></td><td>Position status</td></tr>
            <tr><td><code>estimated_apr</code></td><td>Annualized return estimate</td></tr>
          </tbody>
        </table>

        <h2 id="reporting-policy">Reporting policy</h2>

        <p>PMFI uses report-based accounting.</p>

        <p>
          A report updates official PPS, processes pending deposits, processes pending redemptions, and applies
          performance fees when applicable.
        </p>

        <h3>Normal report behavior</h3>

        <p>A valid report may be submitted when:</p>

        <ul>
          <li>report cooldown has passed</li>
          <li>report data is signed by the report signer</li>
          <li>report data is not expired</li>
          <li>report nonce is higher than the previous nonce</li>
        </ul>

        <h3>Report postponement</h3>

        <p>
          PMFI may postpone a report if reported assets are unexpectedly lower or higher than expected and there
          are no user deposits or redemptions requiring processing.
        </p>

        <p>
          This is intended to avoid updating official PPS or triggering performance fees from temporary reporting
          noise, stale venue balances, bridge delays, API issues, or incomplete offchain reconciliation.
        </p>

        <h3>Important note</h3>

        <p>Report postponement is an operational policy. It does not change the smart contract rules.</p>

        <p>
          A valid onchain report still controls official PPS updates, request processing, and performance fee logic.
        </p>
      </>
    ),
  },

  "user-flow": {
    title: "User flow",
    related: ["accounting-metrics", "liquidity-management", "contract-addresses"],
    content: (
      <>
        <p>PMFI uses asynchronous deposit and redemption requests.</p>

        <p>
          Users do not receive shares or USDC immediately when they submit a request. Requests are processed
          through the vault’s report-based accounting system.
        </p>

        <h2 id="deposit-pricing">Deposit pricing</h2>

        <p>Deposits are processed at the higher of current PPS or the initial $1.00 PPS.</p>

        <CodeBlock>depositPPS = max(currentPPS, INITIAL_PPS)</CodeBlock>

        <p>This means users deposit at:</p>

        <ul>
          <li>$1.00 PPS if current PPS is below $1.00</li>
          <li>current PPS if current PPS is above $1.00</li>
        </ul>

        <p>Shares are minted as:</p>

        <CodeBlock>shares = depositAmount × NAV_PRECISION / depositPPS</CodeBlock>

        <p>This prevents below-$1 deposit entry and protects existing holders from dilution.</p>

        <h2 id="deposit-flow">Deposit flow</h2>

        <h3>1. User submits deposit request</h3>

        <p>The user submits a deposit transaction with USDC.</p>

        <CodeBlock>requestDeposit(uint256 assets, address receiver)</CodeBlock>

        <p>Requirements:</p>

        <CodeBlock>{`assets >= MIN_DEPOSIT_USDC
receiver != address(0)
vault cap is not exceeded`}</CodeBlock>

        <p>The vault transfers USDC from the user and records a pending deposit request.</p>

        <h3>2. Report processes the deposit request</h3>

        <p>A valid report processes pending deposit requests.</p>

        <p>The deposit is priced at:</p>

        <CodeBlock>depositPPS = max(currentReportPPS, INITIAL_PPS)</CodeBlock>

        <p>The request becomes claimable.</p>

        <h3>3. Keeper automation claims shares</h3>

        <p>After the request becomes claimable, keeper automation may call:</p>

        <CodeBlock>autoClaimDeposits(uint256[] requestIds)</CodeBlock>

        <p>Shares are minted to the receiver:</p>

        <CodeBlock>shares = assets × NAV_PRECISION / depositPPS</CodeBlock>

        <h3>4. Manual fallback</h3>

        <p>If automation does not complete the claim, the request owner may call:</p>

        <CodeBlock>claimDeposit(uint256 requestId, address receiver)</CodeBlock>

        <h2 id="redeem-flow">Redeem flow</h2>

        <h3>1. User submits redemption request</h3>

        <p>The user submits a redemption transaction with pARB shares.</p>

        <CodeBlock>requestRedeem(uint256 shares, address receiver)</CodeBlock>

        <p>The vault transfers the user’s pARB shares into the vault and records a pending redeem request.</p>

        <p>Redemptions are priced at the current official PPS.</p>

        <p>The redeem amount is calculated using current official PPS:</p>

        <CodeBlock>lockedAssets = shares × officialPPS / NAV_PRECISION</CodeBlock>

        <h3>2. Report processes the redeem request</h3>

        <p>
          A valid report processes pending redeem requests in FIFO order if sufficient spendable vault liquidity
          is available.
        </p>

        <p>The request becomes claimable when the vault has enough spendable USDC.</p>

        <h3>3. Keeper automation pays USDC</h3>

        <p>After the request becomes claimable, keeper automation may call:</p>

        <CodeBlock>autoClaimRedeems(uint256[] requestIds)</CodeBlock>

        <p>The vault transfers claimable USDC to the receiver.</p>

        <h3>4. Manual fallback</h3>

        <p>If automation does not complete the claim, the request owner may call:</p>

        <CodeBlock>claimRedeem(uint256 requestId, address receiver)</CodeBlock>

        <h2 id="automated-claim-flow">Automated claim flow</h2>

        <p>
          After a deposit or redeem request is processed by a report, PMFI may automatically claim it through
          keeper automation.
        </p>

        <p>
          For deposits, this means pARB shares can be automatically minted to the user’s receiver address after
          the request becomes claimable.
        </p>

        <p>
          For redemptions, this means claimable USDC can be automatically transferred to the user’s receiver
          address after the request becomes claimable.
        </p>

        <p>Users normally only need to submit:</p>

        <ul>
          <li>a deposit request</li>
          <li>or a redemption request</li>
        </ul>

        <p>The rest of the flow may be completed automatically by PMFI keeper automation.</p>

        <h2 id="manual-fallback">Manual fallback</h2>

        <p>
          If automation does not complete the claim, the request owner may still use the claim function directly
          where supported by the contract.
        </p>

        <h2 id="cancel-stale-request">Cancel stale request</h2>

        <p>If a request remains pending longer than:</p>

        <CodeBlock>MAX_REQUEST_AGE = 30 days</CodeBlock>

        <p>the request owner can call:</p>

        <CodeBlock>cancelRequest(uint256 requestId, bool isDeposit)</CodeBlock>

        <p>For stale deposit requests, USDC is returned to the user.</p>

        <p>For stale redeem requests, locked pARB shares are returned to the user.</p>
      </>
    ),
  },

  "liquidity-management": {
    title: "Liquidity management",
    related: ["accounting-metrics", "risk-mitigation"],
    content: (
      <>
        <p>
          The pArbitrage Vault keeps idle USDC in the vault and transfers deployable excess USDC to the arb
          servicer wallet through <code>tend()</code>.
        </p>

        <p><code>tend()</code> is permissionless, but it does not change official accounting.</p>

        <h2 id="idle-balance">Idle balance</h2>

        <CodeBlock>{`idleBalance =
  usdc.balanceOf(vault)
- totalPendingDepositAssets
- totalClaimableRedeemAssets`}</CodeBlock>

        <p>If vault balance is less than reserved assets:</p>

        <CodeBlock>idleBalance = 0</CodeBlock>

        <h2 id="target-idle">Target idle</h2>

        <CodeBlock>{`targetIdle =
  max(
    lastReportedBackingAssets × targetIdleBps / 10,000,
    minimumIdleAmount
  )`}</CodeBlock>

        <table>
          <thead>
            <tr><th>Parameter</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr><td><code>targetIdleBps</code></td><td><code>1000</code></td></tr>
            <tr><td>Target idle percentage</td><td>10%</td></tr>
            <tr><td><code>minimumIdleAmount</code></td><td><code>1e6</code></td></tr>
            <tr><td>Minimum idle amount</td><td>1 USDC</td></tr>
            <tr><td><code>tendCooldown</code></td><td>60 seconds</td></tr>
            <tr><td><code>reportCooldown</code></td><td>3600 seconds</td></tr>
          </tbody>
        </table>

        <h2 id="redemption-reserve">Redemption reserve</h2>

        <CodeBlock>redemptionReserve = totalPendingRedeemShares × officialPPS / NAV_PRECISION</CodeBlock>

        <h2 id="total-reserve">Total reserve</h2>

        <CodeBlock>{`totalReserve =
  redemptionReserve
+ targetIdle`}</CodeBlock>

        <h2 id="deployable-amount">Deployable amount</h2>

        <CodeBlock>{`deployable =
  idleBalance > totalReserve
    ? idleBalance - totalReserve
    : 0`}</CodeBlock>

        <p>If <code>deployable &gt; 0</code>, <code>tend()</code> transfers deployable USDC to:</p>

        <CodeBlock>arbServicerWallet</CodeBlock>

        <h2 id="redemption-repayment-order">Redemption repayment order</h2>

        <p>When redemptions need to be paid, PMFI prioritizes available liquidity before touching open positions.</p>

        <p>The operational repayment order is:</p>

        <ol>
          <li>Vault idle USDC</li>
          <li>Servicer wallet USDC</li>
          <li>Polymarket USDC balance</li>
          <li>Kalshi balance</li>
          <li>Opinion balance</li>
          <li>Settled venue proceeds</li>
        </ol>

        <p>PMFI does not normally sell open arbitrage positions before resolution date.</p>

        <p>Open positions are expected to resolve at settlement rather than being force-sold for routine redemptions.</p>
      </>
    ),
  },

  "risk-disclosure": {
    title: "Risk disclosure",
    related: ["risk-mitigation", "contract-addresses"],
    content: (
      <>
        <Callout>PMFI is currently in beta. Vault performance is not guaranteed. Audit is pending.</Callout>

        <h2 id="execution-risk">Execution risk</h2>

        <p>Automated execution may fail, partially fill, unwind, or be skipped.</p>

        <p>
          Execution depends on live order books, venue availability, order placement, pricing checks, and
          executor infrastructure.
        </p>

        <h2 id="settlement-risk">Settlement risk</h2>

        <p>
          Prediction market settlement may depend on venue rules, resolution timing, claim processes, and
          external event outcomes.
        </p>

        <h2 id="smart-contract-risk">Smart contract risk</h2>

        <p>Vault contracts may contain bugs, vulnerabilities, or unexpected behavior.</p>

        <h2 id="accounting-risk">Accounting risk</h2>

        <p>
          Vault accounting depends on report data, signed reports, offchain balances, open position valuation,
          and correct processing of deposits and redemptions.
        </p>

        <h2 id="liquidity-risk">Liquidity risk</h2>

        <p>
          Redemptions may depend on idle liquidity, settled proceeds, platform balances, pending requests, and
          open positions.
        </p>

        <h2 id="redemption-liquidity-risk">Redemption liquidity risk</h2>

        <p>
          Redemptions are designed to be paid from idle vault liquidity, servicer wallet USDC, platform balances,
          and settled proceeds.
        </p>

        <p>PMFI does not normally sell open positions before resolution date.</p>

        <p>
          If available liquidity is insufficient, redemption processing may be delayed until more liquidity becomes
          available or positions settle.
        </p>
        <h2 id="operational-dependencies">Operational dependencies</h2>

        <p>PMFI may rely on:</p>

        <ul>
          <li>report signer</li>
          <li>executor</li>
          <li>servicer wallet</li>
          <li>RPC provider</li>
          <li>Polymarket API / CLOB</li>
          <li>Kalshi API</li>
          <li>Opinion API / CLOB</li>
          <li>backend database</li>
          <li>app API</li>
        </ul>

        <p>
          Failures or delays in these systems may affect execution, reporting, settlement, redemption processing,
          or displayed app metrics.
        </p>

        <h2 id="known-limitations">Known limitations</h2>

        <table>
          <thead>
            <tr><th>Limitation</th><th>Impact</th></tr>
          </thead>
          <tbody>
            <tr><td>Audit pending</td><td>Smart contract risk remains</td></tr>
            <tr><td>Report-based accounting</td><td>PPS updates only when valid reports are submitted</td></tr>
            <tr><td>Async deposits</td><td>Shares are not minted immediately after deposit request</td></tr>
            <tr><td>Async redemptions</td><td>USDC is not transferred immediately after redemption request</td></tr>
            <tr><td>Deposit PPS floor</td><td>Deposits cannot mint below <code>INITIAL_PPS</code></td></tr>
            <tr><td>Execution depends on venues</td><td>Strategy availability depends on supported prediction markets</td></tr>
            <tr><td>Execution may fail</td><td>Some opportunities may be skipped, retried, hedged, or unwound</td></tr>
            <tr><td>APR / APY are estimates</td><td>Displayed returns may change</td></tr>
            <tr><td>Open position valuation depends on implementation</td><td>Metrics may change if valuation method changes</td></tr>
            <tr><td>Database dependency</td><td>App-level position data may be incomplete if DB writes fail</td></tr>
            <tr><td>Liquidity constraints</td><td>Redemptions may depend on idle liquidity and settled proceeds</td></tr>
          </tbody>
        </table>
      </>
    ),
  },

  "risk-mitigation": {
    title: "Risk mitigation",
    related: ["strategy-logic", "risk-disclosure", "liquidity-management"],
    content: (
      <>
        <h2 id="market-pairing-review">Market pairing review</h2>

        <p>PMFI checks that paired markets represent compatible event exposure before execution.</p>

        <p>
          Markets may be skipped if event wording, expiry, settlement rules, or resolution logic are not compatible.
        </p>

        <h2 id="vwap-based-execution-checks">VWAP-based execution checks</h2>

        <p>PMFI checks executable order book depth instead of relying only on top-of-book prices.</p>

        <p>
          This helps reduce the risk of entering trades that look profitable only at a small displayed size.
        </p>

        <h2 id="second-leg-recovery-logic">Second-leg recovery logic</h2>

        <p>
          If the second leg does not immediately fill, PMFI can retry execution, refresh the order book, and
          complete the hedge if the trade remains profitable.
        </p>

        <p>Unwind is treated as a last-resort option.</p>

        <h2 id="liquidity-haircut">Liquidity haircut</h2>

        <p>The strategy does not assume full venue liquidity is safely fillable.</p>

        <p>By default, it uses only a fraction of the thinner leg’s liquidity:</p>

        <CodeBlock>deployable_size = min(bottleneck_liquidity × ARB_FILLABLE_FRACTION, ARB_MAX_PAIR_USDC)</CodeBlock>

        <h2 id="deposit-pps-floor">Deposit PPS floor</h2>

        <p>Deposits are processed at the higher of current PPS or the initial $1.00 PPS.</p>

        <CodeBlock>depositPPS = max(currentPPS, INITIAL_PPS)</CodeBlock>

        <p>This prevents below-$1 deposit entry and protects existing holders from dilution.</p>

        <h2 id="report-postponement-policy">Report postponement policy</h2>

        <p>
          PMFI may postpone reporting when reported assets are unexpectedly higher or lower than expected and no
          user deposits or redemptions require immediate processing.
        </p>

        <h2 id="redemption-liquidity-waterfall">Redemption liquidity waterfall</h2>

        <p>PMFI prioritizes available liquidity before touching open positions:</p>

        <ol>
          <li>Vault idle USDC</li>
          <li>Servicer wallet USDC</li>
          <li>Polymarket USDC balance</li>
          <li>Kalshi balance</li>
          <li>Opinion balance</li>
          <li>Settled venue proceeds</li>
        </ol>

        <h2 id="no-routine-forced-selling">No routine forced selling</h2>

        <p>PMFI does not normally sell open arbitrage positions before resolution date.</p>

        <p>Positions are generally expected to resolve through settlement.</p>

        <h2 id="stale-quote-filter">Stale quote filter</h2>

        <p>The strategy skips opportunities if the quote is older than the configured stale quote threshold.</p>

        <h2 id="capital-caps">Capital caps</h2>

        <p>PMFI applies per-pair and total deployed capital caps.</p>

        <h2 id="high-water-mark-fees">High-water-mark fees</h2>

        <p>Performance fees are charged only on profit above the previous high-water mark.</p>

        <p>No performance fee is charged during losses or recovery below the high-water mark.</p>

        <h2 id="async-request-cancellation">Async request cancellation</h2>

        <p>If a deposit or redeem request remains pending longer than:</p>

        <CodeBlock>MAX_REQUEST_AGE = 30 days</CodeBlock>

        <p>the request owner may cancel the request.</p>
      </>
    ),
  },

  "contract-addresses": {
    title: "Contract addresses",
    related: ["risk-disclosure", "accounting-metrics"],
    content: (
      <>
        <p>Always verify contract addresses from official PMFI sources.</p>

        <h2 id="base">Base</h2>

        <table>
          <thead>
            <tr><th>Contract</th><th>Address</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr><td>pArbitrage Vault V2</td><td><CopyAddress value={VAULT_ADDRESS} /></td><td>Main pARB vault contract</td></tr>
            <tr><td>USDC</td><td><CopyAddress value={BASE_USDC} /></td><td>Base USDC</td></tr>
            <tr><td>Report signer</td><td><CopyAddress value={REPORT_SIGNER} /></td><td>Signs ReportDataV2</td></tr>
            <tr><td>Arb servicer wallet</td><td><CopyAddress value={ARB_SERVICER} /></td><td>Receives deployable USDC</td></tr>
            <tr><td>Fee recipient</td><td><CopyAddress value={FEE_RECIPIENT} /></td><td>Receives performance fee shares</td></tr>
          </tbody>
        </table>

        <h2 id="verification">Verification</h2>

        <p>Before interacting with contracts:</p>

        <ul>
          <li>verify the domain is <code>pmfi.cc</code> or <code>docs.pmfi.cc</code></li>
          <li>verify the vault address from this page</li>
          <li>compare the contract address with BaseScan</li>
          <li>do not use contract addresses from unofficial links</li>
        </ul>

        <h2 id="main-contract-functions">Main contract functions</h2>

        <table>
          <thead>
            <tr><th>Area</th><th>Functions</th></tr>
          </thead>
          <tbody>
            <tr><td>Deposits</td><td><code>requestDeposit</code>, <code>claimDeposit</code>, <code>autoClaimDeposits</code></td></tr>
            <tr><td>Redemptions</td><td><code>requestRedeem</code>, <code>claimRedeem</code>, <code>autoClaimRedeems</code></td></tr>
            <tr><td>Accounting</td><td><code>report</code>, <code>getVaultState</code>, <code>effectiveDepositPPS</code></td></tr>
            <tr><td>Liquidity</td><td><code>tend</code>, <code>refillBuffer</code>, <code>idleBalance</code></td></tr>
            <tr><td>Admin</td><td><code>setPaused</code>, <code>setShutdown</code>, <code>setFeeRecipient</code>, <code>setArbServicerWallet</code></td></tr>
          </tbody>
        </table>

        <h2 id="key-events">Key events</h2>

        <table>
          <thead>
            <tr><th>Event</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>DepositRequested</code></td><td>Deposit request created</td></tr>
            <tr><td><code>DepositClaimed</code></td><td>pARB shares minted after deposit processing</td></tr>
            <tr><td><code>RedeemRequested</code></td><td>Redemption request created</td></tr>
            <tr><td><code>RedeemClaimed</code></td><td>USDC transferred after redemption processing</td></tr>
            <tr><td><code>Reported</code></td><td>Official vault accounting updated</td></tr>
            <tr><td><code>TendExecuted</code></td><td>Deployable idle USDC moved to servicer wallet</td></tr>
            <tr><td><code>PerfFeeMinted</code></td><td>Performance fee shares minted</td></tr>
            <tr><td><code>Paused</code></td><td>Vault pause status changed</td></tr>
            <tr><td><code>Shutdown</code></td><td>Vault shutdown status changed</td></tr>
          </tbody>
        </table>
      </>
    ),
  },

  "changelog": {
    title: "Changelog",
    related: ["what-is-pmfi", "risk-disclosure", "contract-addresses"],
    content: (
      <>
        <h2 id="2026-05-18">2026-05-18</h2>

        <h3>Docs</h3>
        <ul>
          <li>Updated documentation structure.</li>
          <li>Added market pairing explanation.</li>
          <li>Added VWAP explanation.</li>
          <li>Updated second-leg handling explanation.</li>
          <li>Added risk mitigation page.</li>
          <li>Moved operational dependencies and known limitations into risk disclosure.</li>
          <li>Moved contract functions and key events into contract addresses.</li>
        </ul>

        <h3>App</h3>
        <ul>
          <li>Added vault activity section.</li>
          <li>Added open pairs preview.</li>
        </ul>
      </>
    ),
  },
};

const DEFAULT_PAGE = "what-is-pmfi";

function getInitialPage() {
  if (typeof window === "undefined") return DEFAULT_PAGE;
  const hash = window.location.hash.replace("#", "");
  return docs[hash] ? hash : DEFAULT_PAGE;
}

export default function DocsPage() {
  const [activeId, setActiveId] = useState(getInitialPage);

  useEffect(() => {
    const onHashChange = () => setActiveId(getInitialPage());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const activePage = useMemo(() => docs[activeId] ?? docs[DEFAULT_PAGE], [activeId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-78 shrink-0 overflow-y-auto border-r border-primary/10 px-6 py-6 lg:block">
          <a href="/" className="font-serif text-2xl tracking-[-0.035em] text-primary">
            PMFI Docs
          </a>

          <nav className="mt-7 space-y-6">
            {navSections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-primary/28">
                  {section.title}
                </p>

                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setActiveId(item.id)}
                      className={
                        activeId === item.id
                          ? "docs-sidebar-active"
                          : "block rounded-r-md border-l border-transparent px-3 py-2 text-sm text-primary/43 transition hover:bg-black/10 hover:text-primary/68"
                      }
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-7 md:px-8 md:py-9 lg:px-10">
          <div className="mb-6 flex flex-col gap-4 border-b border-primary/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div className="lg:hidden">
              <a href="/" className="font-serif text-2xl tracking-[-0.035em] text-primary">
                PMFI Docs
              </a>
            </div>

            <div className="hidden lg:block" />

            <div className="flex flex-wrap gap-2">
              <a className="docs-top-btn" href="https://pmfi.cc">Home</a>
              <a className="docs-top-btn" href="https://app.pmfi.cc">Open App</a>
            </div>

            <select
              className="mt-1 w-full rounded-md border border-primary/10 bg-background px-3 py-3 text-sm text-primary lg:hidden"
              value={activeId}
              onChange={(event) => {
                const id = event.target.value;
                window.location.hash = id;
                setActiveId(id);
              }}
            >
              {navSections.map((section) => (
                <optgroup label={section.title} key={section.title}>
                  {section.items.map((item) => (
                    <option value={item.id} key={item.id}>{item.title}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-10">
            <article className="docs-article max-w-[820px]">
              <h1>{activePage.title}</h1>
              {activePage.content}

              <p className="docs-last-updated">
                <em>Last updated: {LAST_UPDATED}</em>
              </p>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
