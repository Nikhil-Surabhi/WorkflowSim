import { Component, useState } from "react";
import Dropzone from "react-dropzone";
import useSpeechToText from 'react-hook-speech-to-text';

import { Editor } from "@tinymce/tinymce-react";
import { uploadMediaFile } from "../Api/file.api";

import swal from "sweetalert";
import CustomSelect from "./CustomSelect";

const TextEditor = ({ description, changeDescription }) => {
    let [editorSel, setEditorSel] = useState(null);

    let [speech, setSpeech] = useState(null);
    let [speechCount, setSpeechCount] = useState(0);

    const {
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText
    } = useSpeechToText({
        continuous: true,
        // timeout: 10000,
        speechRecognitionProperties: {
            // lang: 'es-ES',
            interimResults: true
        },
        onStoppedSpeaking: (res) => {
            console.log('on stop: ', res);
        }
    });

    if (results.length !== speechCount) {
        setSpeech(results[results.length - 1]);
        setSpeechCount(results.length);
    }


    // if(speech) changeDescription(speech + ' ');

    setTimeout(() => {
        editorSel && speech && editorSel.insertContent(speech + ' ');
        setSpeech(null);
    }, 1);

    return <>
        <div className="float-right">
            <span className="d-inline-block mr-2">{isRecording ? 'Listening...' : 'Click to Speak'}</span>
            <button className={isRecording ? "speak-btn listening" : "speak-btn"} onClick={isRecording ? stopSpeechToText : startSpeechToText}>
                <i className="icon-mic"></i>
            </button>
        </div>
        <label>
            Description
        </label>
        <Editor
            onInit={(evt, editor) => {
                setEditorSel(editor)
            }}
            value={description}
            init={{
                height: 300,
                menubar: false,
                branding: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | ' +
                    'bold italic underline | backcolor forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | help speechButton',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            onEditorChange={newText => changeDescription(newText)}
        />
    </>
}

class EditorPopup extends Component {
    state = {
        fields: null,
        changes: false
    }
    constructor(props) {
        super(props);
        if (props.showEditorPopup && props.showEditorPopup.node) {
            this.state = {
                fields: { ...props.showEditorPopup.node }
            }
        }
    }
    changeDescription = description => {
        let fields = this.state.fields;
        fields.description = description;

        this.setState({ fields, changes: true });
    }
    handleChange(e, field) {
        this.changeNode(e.target.value, field);
    }
    changeNode = (val, field) => {
        let fields = this.state.fields;
        fields[field] = val;
        this.setState({ fields, changes: true });
    }
    handleFile = async (e, field) => {
        let file = e.target.files[0];
        let response = await uploadMediaFile(file);

        if (response.success) this.changeNode(response.data.url.Location, field);
    }
    uploadImage = async (file, field) => {
        let response = await uploadMediaFile(file[0]);

        if (response.success) this.changeNode(response.data.url.Location, field);
    }
    saveChanges() {
        this.props.onSave(this.state.fields, this.props.showEditorPopup.index);
        this.closePopup();
    }
    closePopup() {
        this.props.closeEditorPopup()
    }
    componentDidMount() {
        this.props.setStateValue({
            focused: false
        });
    }
    render() {
        let self = this
        // window.addEventListener('keyup', function () {
        //     let textInput = this.document.getElementById('title-input').value;
        //     this.document.getElementById('title-output').innerHTML = textInput;
        // })
        if (this.state.fields) {
            let { name, type, description } = this.state.fields

            return (
                <div className="editorPopup">
                    <div className="editorHeading">
                        <h4>Flowchart Shape Info</h4>
                        <div className="close-btn" onMouseDown={(e) => {
                            if (e.button === 0) {
                                if (self.state.changes) {
                                    swal({
                                        title: "Are you sure?",
                                        text: "Your changes will not made.",
                                        icon: "warning",
                                        buttons: true,
                                        dangerMode: true,
                                    })
                                        .then((willDelete) => {
                                            if (willDelete) {
                                                self.closePopup()
                                            }
                                        });
                                } else {
                                    self.closePopup();
                                }
                            }
                        }}>
                            <i className="icon-close1"></i>
                        </div>
                    </div>
                    <div className="editorBody">
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label>Title</label>
                                    {/* <input name="text" className="form-control" placeholder="Enter Text" autoComplete="off" value={name} onInput={e => this.handleChange(e, 'name')} /> */}
                                    <textarea name="text" id='title-input' className="form-control" placeholder="Enter Text" autoComplete="off" value={name} onInput={e => this.handleChange(e, 'name')}></textarea>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <label>Shape</label>
                                    <CustomSelect items={this.props.shapesList} value={type} chageValue={e => this.changeNode(e, 'type')} />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <TextEditor description={description ? description : ''} changeDescription={(desc) => this.changeDescription(desc)} />
                        </div>
                        <div className="from-group">
                            <Dropzone onDrop={acceptedFiles => this.uploadImage(acceptedFiles, 'photos')}>
                                {({ getRootProps, getInputProps }) => (
                                    <section className="dropzone">
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} accept="image/*" />
                                            <p>Drag 'n' drop some images here, or click to select images</p>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                        </div>
                        <div className="form-group">
                            <label>Attachments</label>
                            <input type="file" accept=".pdf, .docx, .doc" className="d-block" onChange={e => this.handleFile(e, 'attachment')} />
                        </div>
                        <div className="text-right">
                            <button className="btn btn-secondary" onMouseDown={(e) => { if (e.button === 0) this.closePopup() }}>
                                <i className="icon-close"></i>
                                &nbsp; Cancel
                            </button>
                            <button className="btn btn-primary ml-2" onMouseDown={(e) => { if (e.button === 0) this.saveChanges() }}>
                                <i className="icon-check1"></i>
                                &nbsp; Save
                            </button>
                        </div>
                    </div>
                </div >
            );
        } else {
            return null
        }
    }
}

export default EditorPopup;
