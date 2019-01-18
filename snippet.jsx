import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { NotificationManager } from "react-notifications";

import {
  loadProjectsAction,
  updateProjectAction,
  deleteProjectAction
} from "../../Store/Projects/projectActions";
import { arrowRight } from "../../imagesImport";
import { removeEditorInstanceAction } from "../../Store/ProjectsData/EditorInstance/editorInstanceActions";
import ApiHelper from "../../Helper/ApiHelper";

const has = Object.hasOwnProperty;

class CreateProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      title: "",
      description: "",
      redirectToProject: null
    };
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to={`/projects/${this.state.redirectToProject}/campaigns`} />
      );
    }
    if (this.props.isLoggedIn === false) {
      return <Redirect to="/" />;
    }

    return (
      <div className="">
        <div className="titleHeaderCurrent">My projects</div>
        <div className="mainTitle">New Project</div>

        <div className="x_content">
          {this.state.errorMessage
            ? this.state.errorMessage.map(err => (
                <div className="alert alert-danger loginRegisterAlert">
                  {err.message}
                </div>
              ))
            : null}

          <form
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            <div className="createTitle createProjectTitle" htmlFor="title">
              Let's name your project
            </div>
            <div className="container-fluid">
              <div className="row">
                <input
                  type="text"
                  id="title"
                  required="required"
                  placeholder="Name your project"
                  onChange={e => this.updateProjectState("title", e)}
                  className="inputText col-md-5"
                />
                <button
                  onClick={this.createNewProject}
                  className="cta-blue createProjectButton  "
                >
                  Create Project <img src={arrowRight} />
                </button>
                <div className="createProjectCancel  col-md-1">Cancel</div>
              </div>
            </div>
            <div
              className=" createTitle  createProjectTitle"
              htmlFor="description"
            >
              You can also add a short description to know what is it about
            </div>
            <div className="container-fluid">
              <div className="row">
                <textarea
                  type="text"
                  id="description"
                  required="required"
                  placeholder="Description"
                  onChange={e => this.updateProjectState("description", e)}
                  className=" col-md-5 inputText createProjectTextArea"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  createNewProject = () => {
    const { title } = this.state;
    const { description } = this.state;
    ApiHelper.createNewProject(title, description, status)
      .then(res => {
        this.props.updateProjectAction(res.project);
        this.setState({
          redirect: true,
          redirectToProject: res.project.id
        });
        NotificationManager.success(
          `You have successfully created project ${res.project.title}`,
          "Success!"
        );
      })
      .catch(err => {
        this.setState({
          errorMessage: err
        });
        console.log("new Project err", err);
      });
  };

  updateProjectState = (field, e) => {
    this.setState({
      [field]: e.target.value
    });
  };
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  projects: state.projects.byId
});

export default connect(
  mapStateToProps,
  {
    loadProjectsAction,
    updateProjectAction,
    deleteProjectAction,
    removeEditorInstanceAction
  }
)(CreateProject);
