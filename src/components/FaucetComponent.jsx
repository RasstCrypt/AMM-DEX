import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function FaucetComponent(props) {
	const [amountOfUSDT, setAmountOfUSDT] = useState(0);
	const [amountOfCRYPT, setAmountOfCRYPT] = useState(0);

	const onChangeAmountOfCRYPT = (e) => {
		setAmountOfCRYPT(e.target.value);
	};

	const onChangeAmountOfUSDT = (e) => {
		setAmountOfUSDT(e.target.value);
	};

	async function onClickFund() {
		if (props.contract === null) {
			alert("Connect to Metamask");
			return;
		}
		if (["", "."].includes(amountOfUSDT) || ["", "."].includes(amountOfCRYPT)) {
			alert("Amount should be a valid number");
			return;
		}
		try {
			let response = await props.contract.faucet(
				amountOfUSDT * PRECISION,
				amountOfCRYPT * PRECISION
			);
			let res = await response.wait();
			console.log("res", res);
			setAmountOfUSDT(0);
			setAmountOfCRYPT(0);
			await props.getHoldings();
			alert("Success");
		} catch (err) {
			err?.data?.message && alert(err?.data?.message);
			console.log(err);
		}
	}

	return (
		<div className="tabBody">
			<BoxTemplate
				leftHeader={"Amount of USDT"}
				right={"USDT"}
				value={amountOfUSDT}
				onChange={(e) => onChangeAmountOfUSDT(e)}
			/>
			<BoxTemplate
				leftHeader={"Amount of CRYPT"}
				right={"CRYPT"}
				value={amountOfCRYPT}
				onChange={(e) => onChangeAmountOfCRYPT(e)}
			/>
			<div className="bottomDiv">
				<div className="btn" onClick={() => onClickFund()}>
					Fund
				</div>
			</div>
		</div>
	);
}
