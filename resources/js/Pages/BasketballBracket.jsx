import TournamentBracket from "../Components/TournamentBracket";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function App() {
    return (
        <div>
            <AuthenticatedLayout>
                <TournamentBracket />
            </AuthenticatedLayout>
        </div>
    );
}

export default App;
