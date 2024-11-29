import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Fonction générique pour exporter des données en PDF
const exportToPDF = (columns: string[], data: any[], fileName: string) => {
  const doc = new jsPDF();

  // Préparer le titre et la date
  doc.setFontSize(18);
  doc.text(`${fileName} - Rapport des données`, 14, 22);
  doc.setFontSize(12);
  doc.text(`Date : ${new Date().toLocaleDateString()}`, 170, 22, { align: "right" });

  // Préparer les en-têtes et le corps du tableau
  const headers = columns; // Utiliser les valeurs du tableau columns
  const body = data.map(row =>
    columns.map(col => {
      // Lier chaque colonne à la valeur correspondante dans l'objet de données
      return row[col] !== undefined ? String(row[col]) : ""; // Gérer les valeurs undefined
    })
  );

  // Créer le tableau avec autoTable
  autoTable(doc, {
    head: [headers],
    body,
    theme: "striped",
    headStyles: { fillColor: [22, 160, 133] }, // Couleur d'en-tête personnalisée
    styles: { fontSize: 10, cellPadding: 4 },
    margin: { top: 40 },
  });

  // Ajouter un footer avec le copyright centré
  const pageHeight = doc.internal.pageSize.height; // Hauteur de la page
  const footerText = "© 2024 ams.io - Powered by ams.io";

  doc.setFontSize(10);
  const textWidth = doc.getTextWidth(footerText); // Largeur du texte du footer
  const pageWidth = doc.internal.pageSize.width; // Largeur de la page
  const xPosition = (pageWidth - textWidth) / 2; // Calculer la position x pour centrer le texte

  doc.text(footerText, xPosition, pageHeight - 10); // Positionner le footer centré à 10 unités du bas de la page

  // Enregistrer le PDF
  doc.save(`${fileName}_data.pdf`);
};

export default exportToPDF;
