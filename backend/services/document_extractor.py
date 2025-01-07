from io import BytesIO
from pypdf import PdfReader
from docx import Document


def extract_text(file_content, filename):
    if filename.endswith(".pdf"):
        reader = PdfReader(BytesIO(file_content))
        return " ".join(page.extract_text() for page in reader.pages)
    elif filename.endswith(".docx"):
        doc = Document(BytesIO(file_content))
        return " ".join(p.text for p in doc.paragraphs)
    else:
        return file_content.decode("utf-8")
