export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/slogo.png" // Path to your image in the public directory
            alt="Application Logo"
        />
    );
}
