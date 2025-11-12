import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import { FileUpload, Delete, Description, CloudUpload, Close } from '@mui/icons-material';
import { useDocuments, useDocumentTypes, useUploadDocument, useDeleteDocument } from '../hooks/useDocuments';
import { formatFileSize } from '../lib/utils';

export default function DocumentsPage() {
  const { data: documents = [], isLoading } = useDocuments();
  const { data: documentTypes = [] } = useDocumentTypes();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();
  
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [notes, setNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) return;
    
    try {
      await uploadDocument.mutateAsync({
        file: selectedFile,
        type: documentType,
        metadata: {
          notes,
        },
      });
      
      // Reset form
      setSelectedFile(null);
      setDocumentType('');
      setNotes('');
      setOpenUploadDialog(false);
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument.mutateAsync(documentId);
      setDeleteConfirmOpen(null);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return '🗄️';
    return '📄';
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Documents</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUpload />}
          onClick={() => setOpenUploadDialog(true)}
        >
          Upload Document
        </Button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'background.paper',
          }}
        >
          <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No documents found
          </Typography>
          <Typography color="textSecondary" paragraph>
            Upload your first document to get started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUpload />}
            onClick={() => setOpenUploadDialog(true)}
          >
            Upload Document
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <span style={{ marginRight: 8, fontSize: '1.5rem' }}>
                        {getFileIcon(doc.mime_type)}
                      </span>
                      <Typography variant="body2">
                        {doc.metadata?.original_name || doc.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={doc.type} 
                      size="small" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>{formatFileSize(doc.size)}</TableCell>
                  <TableCell>
                    {new Date(doc.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => window.open(doc.url, '_blank')}
                      title="View"
                    >
                      <FileUpload fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => setDeleteConfirmOpen(doc.id)}
                      title="Delete"
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Upload Dialog */}
      <Dialog 
        open={openUploadDialog} 
        onClose={() => setOpenUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${isDragging ? 'primary.main' : 'divider'}`,
              borderRadius: 1,
              p: 4,
              textAlign: 'center',
              backgroundColor: isDragging ? 'action.hover' : 'background.paper',
              mb: 3,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              {selectedFile ? selectedFile.name : 'Drag & drop a file here or click to browse'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {selectedFile 
                ? `${formatFileSize(selectedFile.size)} • ${selectedFile.type}`
                : 'Supports: PDF, JPG, PNG, DOC, XLS up to 10MB'}
            </Typography>
          </Box>
          
          <TextField
            select
            fullWidth
            label="Document Type"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            margin="normal"
            required
          >
            {documentTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            fullWidth
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={!selectedFile || !documentType || uploadDocument.isLoading}
            startIcon={uploadDocument.isLoading ? <CircularProgress size={20} /> : null}
          >
            {uploadDocument.isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!deleteConfirmOpen} 
        onClose={() => setDeleteConfirmOpen(null)}
        maxWidth="xs"
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this document? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(null)}>Cancel</Button>
          <Button
            onClick={() => deleteConfirmOpen && handleDelete(deleteConfirmOpen)}
            color="error"
            variant="contained"
            disabled={deleteDocument.isLoading}
            startIcon={deleteDocument.isLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteDocument.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
