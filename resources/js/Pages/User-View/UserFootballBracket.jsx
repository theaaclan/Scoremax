import UserTournamentBracket from "../../Components/UserTournamentBracket";
import Navbar from "../../Layouts/Navbar";

function App() {
    const styles = {
        Container: {
            display: "flex",
            marginTop: "130px",
            marginLeft: "120px",
        },
        Title: {
            fontSize: "32px",
            fontWeight: "bold",
            margin: "20px",
        },
        Branch_1: {
            height: "620px",
            width: "450px",
            flexWrap: "wrap",
            display: "flex",
        },
        Branch_2: {
            height: "300px",
            width: "400px",
            flexWrap: "wrap",
            display: "flex",
            marginTop: "160px",
        },
        Branch_3: {
            height: "150px",
            width: "400px",
            flexWrap: "wrap",
            display: "flex",
            marginTop: "240px",
        },
        Object_1_even: {
            display: "grid",
            gridTemplateColumns: "230px 100px",
            gridTemplateRows: "50px 50px",
            backgroundColor: "rgb(153, 153, 153)",
            width: "300px",
            paddingTop: "40px",
            paddingLeft: "4px",
        },
        Object_1_odd: {
            display: "grid",
            gridTemplateColumns: "230px 100px",
            gridTemplateRows: "50px 50px",
            backgroundColor: "rgb(110, 110, 110)",
            width: "300px",
            paddingTop: "40px",
            paddingLeft: "4px",
        },
        Name: {
            width: "210px",
            height: "40px",
            fontSize: "20px",
            borderRadius: "4px",
        },
    };
    return (
        <div>
            <Navbar />
            <h1 style={styles.Title}>Football Tournament Bracket</h1>
            <UserTournamentBracket />
        </div>
    );
}

export default App;
