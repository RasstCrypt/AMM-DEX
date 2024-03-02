import { useEffect, useState } from "react";
import "../styles.css";
import SwapComponent from "./SwapComponent";
import ProvideComponent from "./ProvideComponent";
import WithdrawComponent from "./WithdrawComponent";
import FaucetComponent from "./FaucetComponent";
import { PRECISION } from "../constants";

export default function ContainerComponent(props) {
	const [activeTab, setActiveTab] = useState("Swap");
	const [amountOfUSDT, setAmountOfUSDT] = useState(0);
	const [amountOfCRYPT, setAmountOfCRYPT] = useState(0);
	const [amountOfShare, setAmountOfShare] = useState(0);
	const [totalUSDT, setTotalUSDT] = useState(0);
	const [totalCRYPT, setTotalCRYPT] = useState(0);
	const [totalShare, setTotalShare] = useState(0);

	useEffect(() => {
		getHoldings();
	});

    //fetch the pool details and personal assets details.
	async function getHoldings() {
		try {
			console.log("Fetching holdings----");
			let response = await props.contract.getMyHoldings();
			setAmountOfUSDT(response.amountToken1 / PRECISION);
			setAmountOfCRYPT(response.amountToken2 / PRECISION);
			setAmountOfShare(response.myShare / PRECISION);

			response = await props.contract.getPoolDetails();
			setTotalUSDT(response[0] / PRECISION);
			setTotalCRYPT(response[1] / PRECISION);
			setTotalShare(response[2] / PRECISION);
		} catch (err) {
			console.log("Couldn't Fetch holdings", err);
		}
	}

	const changeTab = (tab) => {
		setActiveTab(tab);
	};

	return (
		<div className="centerBody">
			<div className="centerContainer">
				<div className="selectTab">
					<div
						className={"tabStyle " + (activeTab === "Swap" ? "activeTab" : "")}
						onClick={() => changeTab("Swap")}
					>
						Swap
					</div>
					<div
						className={
							"tabStyle " + (activeTab === "Provide" ? "activeTab" : "")
						}
						onClick={() => changeTab("Provide")}
					>
						Provide
					</div>
					<div
						className={
							"tabStyle " + (activeTab === "Withdraw" ? "activeTab" : "")
						}
						onClick={() => changeTab("Withdraw")}
					>
						Withdraw
					</div>
					<div
						className={
							"tabStyle " + (activeTab === "Faucet" ? "activeTab" : "")
						}
						onClick={() => changeTab("Faucet")}
					>
						Faucet
					</div>
				</div>

				{activeTab === "Swap" && (
					<SwapComponent
						contract={props.contract}
						getHoldings={() => getHoldings()}
					/>
				)}
				{activeTab === "Provide" && (
					<ProvideComponent
						contract={props.contract}
						getHoldings={() => getHoldings()}
					/>
				)}
				{activeTab === "Withdraw" && (
					<WithdrawComponent
						contract={props.contract}
						maxShare={amountOfShare}
						getHoldings={() => getHoldings()}
					/>
				)}
				{activeTab === "Faucet" && (
					<FaucetComponent
						contract={props.contract}
						getHoldings={() => getHoldings()}
					/>
				)}
			</div>
			<div className="details">
				<div className="detailsBody">
					<div className="detailsHeader">Details</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Amount of USDT:</div>
						<div className="detailsValue">{amountOfUSDT}</div>
					</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Amount of CRYPT:</div>
						<div className="detailsValue">{amountOfCRYPT}</div>
					</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Your Share:</div>
						<div className="detailsValue">{amountOfShare}</div>
					</div>
					<div className="detailsHeader">Pool Details</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Total USDT:</div>
						<div className="detailsValue">{totalUSDT}</div>
					</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Total CRYPT:</div>
						<div className="detailsValue">{totalCRYPT}</div>
					</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Total Shares:</div>
						<div className="detailsValue">{totalShare}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
