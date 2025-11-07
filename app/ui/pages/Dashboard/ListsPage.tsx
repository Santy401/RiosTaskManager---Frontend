import { useState, useEffect } from "react";
import { UserList } from "../../components/ListsComponents/userList";
import { CompanyList } from "../../components/ListsComponents/Company/CompanyList";
import { AreaList } from "../../components/ListsComponents/AreaList";

interface ListsPageProps {
    selectedList?: string;
}

const ListsPage = ({ selectedList = 'listas' }: ListsPageProps) => {
    const [activeTab, setActiveTab] = useState("users");

    useEffect(() => {
        // Set active tab based on selectedList prop
        switch (selectedList) {
            case 'listas-usuarios':
                setActiveTab("users");
                break;
            case 'listas-empresas':
                setActiveTab("companies");
                break;
            case 'listas-areas':
                setActiveTab("areas");
                break;
            default:
                setActiveTab("users");
        }
    }, [selectedList]);

    const renderContent = () => {
        switch (activeTab) {
            case "users":
                return <UserList />;
            case "companies":
                return <CompanyList />;
            case "areas":
                return <AreaList />;
            default:
                return <UserList />;
        }
    };

    return (
        <div className="lists-page-container">
            <div className="tab-content">{renderContent()}</div>
        </div>
    );
};

export default ListsPage;
