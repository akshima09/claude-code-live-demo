import type { Member } from "./api.ts";

type DashboardProps = {
  member: Member;
  onSignOut: () => void;
};

const transactions = [
  { icon: "S", merchant: "Salary deposit", date: "Oct 3", amount: "+$4,850.00", positive: true },
  { icon: "F", merchant: "Fresh Market", date: "Oct 2", amount: "−$86.24", positive: false },
  { icon: "U", merchant: "Utility payment", date: "Oct 1", amount: "−$142.80", positive: false },
  { icon: "C", merchant: "Corner Café", date: "Sep 30", amount: "−$12.50", positive: false },
];

const spending = [
  { label: "Home", value: "$1,240", width: "72%" },
  { label: "Food", value: "$620", width: "46%" },
  { label: "Travel", value: "$380", width: "28%" },
  { label: "Other", value: "$210", width: "18%" },
];

export function Dashboard({ member, onSignOut }: DashboardProps) {
  const firstName = member.displayName.split(" ")[0];

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <a className="dashboard-brand" href="#overview" aria-label="Horizon home">
          <span className="brand-mark compact" aria-hidden="true">N</span>
          <span>Horizon</span>
        </a>
        <nav className="dashboard-nav" aria-label="Member navigation">
          <a className="active" href="#overview">Overview</a>
          <a href="#accounts">Accounts</a>
          <a href="#activity">Activity</a>
        </nav>
        <div className="member-menu">
          <button className="icon-button" type="button" aria-label="Notifications">
            <span aria-hidden="true">●</span>
          </button>
          <span className="avatar" aria-hidden="true">AS</span>
          <button className="sign-out-button" type="button" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <div className="dashboard-content" id="overview">
        <section className="welcome-row" aria-labelledby="welcome-title">
          <div>
            <p className="eyebrow accent">MONDAY, OCTOBER 5</p>
            <h1 id="welcome-title">Good morning, {firstName}</h1>
            <p>Here’s a clear look at your money today.</p>
          </div>
          <span className="demo-badge">Demo member data</span>
        </section>

        <section className="balance-card" aria-labelledby="balance-title">
          <div className="balance-main">
            <p id="balance-title">Total available balance</p>
            <strong>$18,420.67</strong>
            <span>Across your deposit accounts</span>
          </div>
          <div className="quick-actions" aria-label="Quick actions">
            <button type="button"><span aria-hidden="true">↗</span>Transfer</button>
            <button type="button"><span aria-hidden="true">▣</span>Pay a bill</button>
            <button type="button"><span aria-hidden="true">＋</span>Deposit</button>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="content-card accounts-card" id="accounts" aria-labelledby="accounts-title">
            <div className="card-heading">
              <div>
                <p className="eyebrow accent">YOUR MONEY</p>
                <h2 id="accounts-title">Accounts</h2>
              </div>
              <button className="text-button" type="button">View all</button>
            </div>

            <article className="account-row">
              <span className="account-icon checking" aria-hidden="true">C</span>
              <div>
                <h3>Everyday Checking</h3>
                <p>•••• 4821</p>
              </div>
              <div className="account-value"><strong>$8,420.67</strong><span>Available</span></div>
            </article>
            <article className="account-row">
              <span className="account-icon savings" aria-hidden="true">S</span>
              <div>
                <h3>Goal Savings</h3>
                <p>•••• 1904</p>
              </div>
              <div className="account-value"><strong>$10,000.00</strong><span>Available</span></div>
            </article>
            <article className="account-row">
              <span className="account-icon credit" aria-hidden="true">V</span>
              <div>
                <h3>Horizon Visa</h3>
                <p>•••• 7108</p>
              </div>
              <div className="account-value"><strong>$1,284.32</strong><span>Current balance</span></div>
            </article>
          </section>

          <section className="content-card spending-card" aria-labelledby="spending-title">
            <div className="card-heading">
              <div>
                <p className="eyebrow accent">THIS MONTH</p>
                <h2 id="spending-title">Spending</h2>
              </div>
              <strong className="spending-total">$2,450</strong>
            </div>
            <div className="spending-bars">
              {spending.map((category) => (
                <div className="spending-item" key={category.label}>
                  <div><span>{category.label}</span><strong>{category.value}</strong></div>
                  <div className="bar-track"><span style={{ width: category.width }} /></div>
                </div>
              ))}
            </div>
            <p className="insight"><span aria-hidden="true">↓</span> You spent 12% less than last month.</p>
          </section>

          <section className="content-card activity-card" id="activity" aria-labelledby="activity-title">
            <div className="card-heading">
              <div>
                <p className="eyebrow accent">LATEST</p>
                <h2 id="activity-title">Recent activity</h2>
              </div>
              <button className="text-button" type="button">See all activity</button>
            </div>
            <div className="transaction-list">
              {transactions.map((transaction) => (
                <article className="transaction-row" key={`${transaction.merchant}-${transaction.date}`}>
                  <span className="transaction-icon" aria-hidden="true">{transaction.icon}</span>
                  <div><h3>{transaction.merchant}</h3><p>{transaction.date} · Checking</p></div>
                  <strong className={transaction.positive ? "positive" : ""}>{transaction.amount}</strong>
                </article>
              ))}
            </div>
          </section>

          <aside className="security-card" aria-labelledby="security-title">
            <span className="security-icon" aria-hidden="true">✓</span>
            <div>
              <h2 id="security-title">You’re protected</h2>
              <p>Last sign-in: today from your trusted device.</p>
            </div>
            <button className="text-button light" type="button">Security center</button>
          </aside>
        </div>
      </div>
    </main>
  );
}

