import Form from "./styles/Form";
import useForm from "../lib/useForm";
import { gql, useMutation } from "@apollo/client";
import DisplayError from "./DisplayError";

const RESET_MUTATION = gql`
	mutation RESET_MUTATION(
		$email: String!
		$password: String!
		$token: String!
) {
		redeemUserPasswordResetToken(
			email: $email
			password: $password
			token: $token
		) {
			code
			message
		}
	}
`;

export default function Reset({ token }) {
	const { inputs, handleChange, resetForm } = useForm({
		email: "",
    password: '',
    token,
	});
	const [reset, { data, loading, error }] = useMutation(
		RESET_MUTATION,
		{
			variables: inputs,
		}
	);
  const successfulError = data?.redeemUserPasswordResetToken?.code ? 
    data?.redeemUserPasswordResetToken : undefined;

	async function handleSubmit(e) {
		e.preventDefault();
		console.log(inputs);
		const res = await reset().catch(console.error);
		resetForm();
	}

	return (
		<Form method="POST" onSubmit={handleSubmit}>
			<h2>Reset Your Password</h2>
			<DisplayError error={error || successfulError} />
			<fieldset>
				{data?.redeemUserPasswordResetToken === null && (
					<p>Password reset successful! You can sign in with your new password.</p>
				)}
				<label htmlFor="email">
					Email
					<input
						type="email"
						name="email"
						placeholder="Your email address"
						autoComplete="email"
						value={inputs.email}
						onChange={handleChange}
					/>
				</label>
				<label htmlFor="password">
					Password
					<input
						type="password"
						name="password"
						placeholder="Your password"
						autoComplete="password"
						value={inputs.password}
						onChange={handleChange}
					/>
				</label>
				<button type="submit">Request Reset</button>
			</fieldset>
		</Form>
	);
}
