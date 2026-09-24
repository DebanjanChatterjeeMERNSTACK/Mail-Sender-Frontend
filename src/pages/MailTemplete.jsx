import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { toast } from "react-toastify";
import { MAIL } from "../config/api";
import {
  Plus,
  Mail,
  Paperclip,
  Pencil,
  Trash2,
  ExternalLink,
  FileText,
  Inbox,
  Send,
  LoaderCircle,
} from "lucide-react";
import {
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  BtnClearFormatting,
} from "react-simple-wysiwyg";

const emptyForm = { subject: "", bodyMail: "", file: null };

const MailTemplete = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(MAIL.ReadTemplete, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Unable to load templates");
      setTemplates(data.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) =>
    setFormData({ ...formData, file: e.target.files[0] || null });

  const openCreateModal = () => {
    setEditingTemplate(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setFormData({
      subject: template.subjectMail,
      bodyMail: template.bodyMail,
      file: null,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setShowModal(false);
      setEditingTemplate(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDatas = new FormData();
      formDatas.append("subjectMail", formData.subject);
      formDatas.append("bodyMail", formData.bodyMail);
      if (formData.file) formDatas.append("cvLink", formData.file);

      const response = await fetch(
        editingTemplate
          ? `${MAIL.UpdateTemplete}/${editingTemplate._id}`
          : MAIL.createTemplete,
        {
          method: editingTemplate ? "PUT" : "POST",
          headers: getHeaders(),
          body: formDatas,
        },
      );
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Something went wrong");

      toast.success(
        data.message ||
          (editingTemplate
            ? "Template updated successfully"
            : "Template created successfully"),
      );
      setShowModal(false);
      setEditingTemplate(null);
      setFormData(emptyForm);
      await fetchTemplates();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (templateId) => {
    setDeleteTemplateId(templateId);
  };

  const handleDelete = async () => {
    const templateId = deleteTemplateId;
    if (!templateId) return;

    setDeleteTemplateId(null);
    setIsDeleting(templateId);
    try {
      const response = await fetch(`${MAIL.DeleteTemplete}/${templateId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Unable to delete template");
      setTemplates((current) =>
        current.filter(({ _id }) => _id !== templateId),
      );
      toast.success(data.message || "Template deleted successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSendEmail = async (template) => {
    if (!email) {
      toast.error("Please enter recipient email");
      return;
    }

    try {
      setIsSending(template._id);

      const token = localStorage.getItem("token");

      const response = await fetch(MAIL.MailSend, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          templateId: template._id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Failed to send email");
        return;
      }

      toast.success(data.message || "Email sent successfully");

      // Clear email input after successful send
      setEmail("");
    } catch (error) {
      console.error("Send email error:", error);
      toast.error(error.message);
    } finally {
      setIsSending(null);
    }
  };

  return (
    <>
      {/* <Header /> */}

      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <Mail size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                  Mail Templates
                </h1>

                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  Create and manage your email templates.
                </p>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={openCreateModal}
              className="group cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg sm:w-auto"
            >
              <Plus
                size={20}
                className="transition-transform duration-200 group-hover:rotate-90"
              />
              Add Template
            </button>
          </div>

          {/* Main Card */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-800">
                    Your Templates
                  </h2>

                  <p className="text-xs text-slate-500">
                    Manage your saved email templates
                  </p>
                </div>
              </div>
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="flex min-h-[250px] flex-col items-center justify-center gap-3 text-slate-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <Mail className="animate-pulse text-blue-600" size={24} />
                </div>

                <p className="text-sm">Loading templates...</p>
              </div>
            ) : templates.length === 0 ? (
              /* Empty State */
              <div className="flex min-h-[350px] flex-col items-center justify-center px-5 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <Inbox size={36} className="text-slate-400" />
                </div>

                <h3 className="text-lg font-semibold text-slate-800">
                  No templates yet
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  Create your first email template to save time when sending
                  emails.
                </p>

                <button
                  onClick={openCreateModal}
                  className="mt-5 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Create Template
                </button>
              </div>
            ) : (
              /* Template List */

              <div className="divide-y divide-slate-100">
                {templates.map((template) => (
                  <article
                    key={template._id}
                    className="group p-5 transition-all duration-200 hover:bg-slate-50 sm:p-6"
                  >
                    {/* Template Information */}
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      {/* Left Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          {/* Mail Icon */}
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Mail size={19} />
                          </div>

                          <div className="min-w-0 flex-1">
                            {/* Subject */}
                            <h3 className="break-words text-base font-semibold text-slate-800 sm:text-lg">
                              {template.subjectMail}
                            </h3>

                            {/* Body */}
                            <p
                              className="mt-2 break-words text-sm leading-6 text-slate-500"
                              dangerouslySetInnerHTML={{
                                __html: template.bodyMail,
                              }}
                            />
                            {/* Attachment */}
                            {template.cvLink && (
                              <a
                                href={template.cvLink}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-200 hover:bg-blue-100"
                              >
                                <Paperclip size={16} />
                                View Attachment
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-2 lg:ml-6">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => openEditModal(template)}
                          className="group/edit flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil
                            size={16}
                            className="transition-transform group-hover/edit:-rotate-12"
                          />

                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => confirmDelete(template._id)}
                          disabled={isDeleting === template._id}
                          className="group/delete flex cursor-pointer items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-medium text-red-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeleting === template._id ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : (
                            <Trash2
                              size={16}
                              className="transition-transform group-hover/delete:scale-110"
                            />
                          )}

                          <span className="hidden sm:inline">
                            {isDeleting === template._id
                              ? "Deleting..."
                              : "Delete"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Send Email Section */}
                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <div className="mb-2 flex items-center gap-2">
                        <Send size={15} className="text-blue-600" />

                        <label className="text-sm font-semibold text-slate-700">
                          Send this template
                        </label>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        {/* Email Input */}
                        <div className="relative flex-1">
                          <Mail
                            size={17}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter recipient email address"
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                          />
                        </div>

                        {/* Send Button */}
                        <button
                          type="button"
                          onClick={() => handleSendEmail(template)}
                          disabled={isSending === template._id}
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSending === template._id ? (
                            <>
                              <LoaderCircle
                                size={17}
                                className="animate-spin"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={17} />
                              Send Email
                            </>
                          )}
                        </button>
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        The selected template will be sent to this email
                        address.
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {deleteTemplateId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Delete template?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              This action cannot be undone.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTemplateId(null)}
                className="w-full rounded-lg border cursor-pointer border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-100 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full rounded-lg cursor-pointer bg-red-600 px-4 py-2.5 text-white hover:bg-red-700 sm:w-auto"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-blue-200 px-4 py-3 sm:px-5">
              <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                {editingTemplate ? "Edit Mail Template" : "Add Mail Template"}
              </h2>
              <button
                onClick={closeModal}
                className="flex cursor-pointer h-9 w-9 items-center justify-center rounded-full bg-red-600 pb-1 text-xl leading-none text-white hover:bg-red-800"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 p-3 sm:p-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Mail Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter mail subject"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Mail Body
                </label>

                <div className="overflow-hidden rounded-lg border border-gray-300">
                  <EditorProvider>
                    <Editor
                      value={formData.bodyMail}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bodyMail: e.target.value,
                        }))
                      }
                    >
                      <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <BtnLink />
                        <BtnClearFormatting />
                      </Toolbar>
                    </Editor>
                  </EditorProvider>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {editingTemplate ? "Replace File (optional)" : "Upload File"}
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  required={!editingTemplate}
                  className="w-full min-w-0 rounded-lg border border-gray-300 p-2 text-sm"
                />
                {formData.file && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {formData.file.name}
                  </p>
                )}
              </div>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-100 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </span>
                  ) : editingTemplate ? (
                    "Update Template"
                  ) : (
                    "Save Template"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MailTemplete;
