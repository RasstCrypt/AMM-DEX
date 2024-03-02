import { MdAdd } from "react-icons/md";
import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function ProvideComponent(props) {
	const [amountOfUSDT, setAmountOfUSDT] = useState(0);
	const [amountOfCRYPT, setAmountOfCRYPT] = useState(0);
	const [error, setError] = useState("");

	const getProvideEstimate = async (token, value) => {
		if (["", "."].includes(value)) return;
		if (props.contract !== null) {
			try {
				let estimate;
				if (token === "USDT") {
					estimate = await props.contract.getEquivalentToken2Estimate(
						value * PRECISION
					);
					setAmountOfCRYPT(estimate / PRECISION);
				} else {
					estimate = await props.contract.getEquivalentToken1Estimate(
						value * PRECISION
					);
					setAmountOfUSDT(estimate / PRECISION);
				}
			} catch (err) {
				console.log("Err: ", err);
				if (err.data.message.includes("Zero Liquidity")) {
					setError("Message: Empty pool. Set the initial conversion rate.");
				} else {
					alert(err?.data?.message);
				}
			}
		}
	};

	const onChangeAmountOfUSDT = (e) => {
		setAmountOfUSDT(e.target.value);
		getProvideEstimate("USDT", e.target.value);
	};

	const onChangeAmountOfCRYPT = (e) => {
		setAmountOfCRYPT(e.target.value);
		getProvideEstimate("CRYPT", e.target.value);
	};

	const provide = async () => {
		if (["", "."].includes(amountOfUSDT) || ["", "."].includes(amountOfCRYPT)) {
			alert("Amount should be a valid number");
			return;
		}
		if (props.contract === null) {
			alert("Connect to Metamask");
			return;
		} else {
			try {
				let response = await props.contract.provide(
					amountOfUSDT * PRECISION,
					amountOfCRYPT * PRECISION
				);
				await response.wait();
				setAmountOfUSDT(0);
				setAmountOfCRYPT(0);
				await props.getHoldings();
				alert("Success");
				setError("");
			} catch (err) {
				err && alert(err?.data?.message);
			}
		}
	};

	return (
		<div className="tabBody">
			<BoxTemplate
				leftHeader={"Amount of USDT"}
				value={amountOfUSDT}
				onChange={(e) => onChangeAmountOfUSDT(e)}
			/>
			<div className="swapIcon">
				<MdAdd />
			</div>
			<BoxTemplate
				leftHeader={"Amount of CRYPT"}
				value={amountOfCRYPT}
				onChange={(e) => onChangeAmountOfCRYPT(e)}
			/>
			<div className="error">{error}</div>
			<div className="bottomDiv">
				<div className="btn" onClick={() => provide()}>
					Provide
				</div>
			</div>
		</div>
	);
}
