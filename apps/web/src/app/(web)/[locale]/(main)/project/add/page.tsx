import { SubPageTemplate } from "@/components/page/main/global/SubPageTemplate"
import { AddProjectForm } from "@/components/page/main/project/AddProjectForm";

const AddProjectPage = () => {
    return (
        <SubPageTemplate
            className="add-project-page"
            pageTitle="Add Project Page"
        >
            <AddProjectForm
                className="add-project-form"
            >
                <div>
                    <input type="text" name="project-name"></input>
                </div>
                <div>
                    <input type="text" name="project-alias"></input>
                </div>
               
            </AddProjectForm>
        </SubPageTemplate>
    )
}

export default AddProjectPage;