import TournamentBracket from "../../Components/TournamentBracket";
import "@css/tournament.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function App() {
    const styles = {
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
        Titles: {
            position: "absolute",
        },
    };
    return (
        <div>
            <AuthenticatedLayout>
                <h1 className="Titles">Baseball Tournament Bracket</h1>
                <TournamentBracket />
            </AuthenticatedLayout>
        </div>
    );
}

export default App;
