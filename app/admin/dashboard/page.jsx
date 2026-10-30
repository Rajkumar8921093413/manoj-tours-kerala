'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatImageUrl } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'safaris' | 'packages' | 'settings'
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Day & Night Mode state
  const [theme, setTheme] = useState('dark');

  // Full-size image preview lightbox modal
  const [previewModal, setPreviewModal] = useState(null); // { src, title }

  // Data states
  const [rooms, setRooms] = useState([]);
  const [safaris, setSafaris] = useState([]);
  const [packages, setPackages] = useState([]);

  // Modals state
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomImageManagerOpen, setRoomImageManagerOpen] = useState(false);
  const [activeRoomForImages, setActiveRoomForImages] = useState(null);

  const [safariModalOpen, setSafariModalOpen] = useState(false);
  const [editingSafari, setEditingSafari] = useState(null);

  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  // Credentials form state
  const [credForm, setCredForm] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [credLoading, setCredLoading] = useState(false);
  const [seederLoading, setSeederLoading] = useState(false);

  // File upload state
  const [uploading, setUploading] = useState(false);

  // Operation Loading States for Add, Edit, Delete, Upload & Sync
  const [roomSaving, setRoomSaving] = useState(false);
  const [safariSaving, setSafariSaving] = useState(false);
  const [packageSaving, setPackageSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // e.g. 'room-1', 'safari-2', 'pkg-3'
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryActionId, setGalleryActionId] = useState(null); // 'primary-12', 'del-12'
  const [dataRefreshing, setDataRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Initialize Theme
    const savedTheme = localStorage.getItem('manoj_admin_theme') || localStorage.getItem('manoj_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-admin-theme', savedTheme);

    fetchAdminStatus();
    loadAllData();
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('manoj_admin_theme', next);
    document.documentElement.setAttribute('data-admin-theme', next);
  };

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const fetchAdminStatus = async () => {
    try {
      const res = await fetch('/api/admin/me');
      if (!res.ok) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setAdminUser(data.user);
    } catch (e) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async (silent = false) => {
    if (!silent) setDataRefreshing(true);
    try {
      const [rRes, sRes, pRes] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/safaris'),
        fetch('/api/packages')
      ]);

      if (rRes.ok) setRooms(await rRes.json());
      if (sRes.ok) setSafaris(await sRes.json());
      if (pRes.ok) setPackages(await pRes.json());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      if (!silent) setDataRefreshing(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
      showNotice('error', 'Failed to log out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  // Helper for image upload with size & format validation
  const uploadImageFile = async (file, folder = 'rooms') => {
    if (!file) return null;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showNotice('error', 'File size exceeds 10MB limit. Please choose a smaller photo.');
      return null;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showNotice('error', 'Unsupported format. Please upload JPG, PNG, or WebP images.');
      return null;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      showNotice('success', `Image uploaded successfully: ${data.fileName}`);
      return data.url;
    } catch (err) {
      showNotice('error', err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  /* ==========================================================================
     ROOMS MANAGEMENT HANDLERS
     ========================================================================== */
  const openCreateRoomModal = () => {
    setEditingRoom({
      id: null,
      name: '',
      category: 'deluxe',
      price: 2500,
      show_price: true,
      price_basis: 'Per Room / Per Night',
      capacity: '2 Adults',
      location: 'Near the River, Marayoor / Anakulam',
      primary_image: '/assets/images/room_cottage_villa.jpg',
      featuresText: 'Rooms Near the River with soothing breeze\nAttached modern bathroom\nComfortable King Bed\nFree Wi-Fi & Hot Water',
      dining_note: 'Homely Kerala meals available on request.',
      disclaimer: 'Price Basis: Per Room / Per Night. Rates vary by season.'
    });
    setRoomModalOpen(true);
  };

  const openEditRoomModal = (room) => {
    setEditingRoom({
      ...room,
      primary_image: formatImageUrl(room.primary_image),
      featuresText: Array.isArray(room.features) ? room.features.join('\n') : ''
    });
    setRoomModalOpen(true);
  };

  const saveRoom = async (e) => {
    e.preventDefault();
    setRoomSaving(true);
    const features = editingRoom.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const payload = {
      name: editingRoom.name,
      category: editingRoom.category,
      price: parseInt(editingRoom.price, 10) || 0,
      show_price: Boolean(editingRoom.show_price),
      price_basis: editingRoom.price_basis,
      capacity: editingRoom.capacity,
      location: editingRoom.location,
      primary_image: formatImageUrl(editingRoom.primary_image),
      features,
      dining_note: editingRoom.dining_note,
      disclaimer: editingRoom.disclaimer
    };

    try {
      let res;
      if (editingRoom.id) {
        res = await fetch(`/api/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save room');

      showNotice('success', editingRoom.id ? 'Room updated successfully!' : 'Room created successfully!');
      setRoomModalOpen(false);
      await loadAllData();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setRoomSaving(false);
    }
  };

  const deleteRoom = async (id, name) => {
    if (!confirm(`Are you sure you want to delete room: "${name}"?`)) return;
    setDeletingId(`room-${id}`);
    try {
      const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete room');
      showNotice('success', 'Room deleted successfully');
      await loadAllData();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Multi-image management for room
  const openImageManager = (room) => {
    setActiveRoomForImages(room);
    setRoomImageManagerOpen(true);
  };

  const handleAddRoomImage = async (file) => {
    if (!file || !activeRoomForImages) return;
    setGalleryUploading(true);
    try {
      const url = await uploadImageFile(file, 'rooms');
      if (!url) return;

      const res = await fetch(`/api/rooms/${activeRoomForImages.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url })
      });
      if (!res.ok) throw new Error('Failed to attach image');
      showNotice('success', 'Image added to room gallery!');
      await loadAllData(true);
      const updatedRoomsRes = await fetch('/api/rooms');
      const updatedRooms = await updatedRoomsRes.json();
      setRooms(updatedRooms);
      const found = updatedRooms.find(r => r.id === activeRoomForImages.id);
      if (found) setActiveRoomForImages(found);
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleDeleteRoomImage = async (imageId) => {
    if (!confirm('Delete this photo from gallery?')) return;
    setGalleryActionId(`del-${imageId}`);
    try {
      const res = await fetch(`/api/rooms/${activeRoomForImages.id}/images?imageId=${imageId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete image');
      showNotice('success', 'Image removed');
      await loadAllData(true);
      const updatedRoomsRes = await fetch('/api/rooms');
      const updatedRooms = await updatedRoomsRes.json();
      setRooms(updatedRooms);
      const found = updatedRooms.find(r => r.id === activeRoomForImages.id);
      if (found) setActiveRoomForImages(found);
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setGalleryActionId(null);
    }
  };

  const handleSetPrimaryImage = async (imageId, url) => {
    setGalleryActionId(`primary-${imageId}`);
    try {
      const res = await fetch(`/api/rooms/${activeRoomForImages.id}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, image_url: url })
      });
      if (!res.ok) throw new Error('Failed to set primary image');
      showNotice('success', 'Primary cover photo updated!');
      await loadAllData(true);
      const updatedRoomsRes = await fetch('/api/rooms');
      const updatedRooms = await updatedRoomsRes.json();
      setRooms(updatedRooms);
      const found = updatedRooms.find(r => r.id === activeRoomForImages.id);
      if (found) setActiveRoomForImages(found);
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setGalleryActionId(null);
    }
  };

  /* ==========================================================================
     JEEP SAFARI MANAGEMENT HANDLERS
     ========================================================================== */
  const openCreateSafariModal = () => {
    setEditingSafari({
      id: null,
      title: '',
      badge: '⛰️ Peak Safari',
      description: '',
      duration: '3 - 4 Hours',
      terrain_tag: 'Rugged Climb',
      price_info: '₹2,500 – ₹3,500 per Jeep',
      weather_note: 'Routes and stops may vary depending on weather, road conditions, and forest rules.',
      primary_image: '/assets/images/jeep_mountain_peak.jpg'
    });
    setSafariModalOpen(true);
  };

  const openEditSafariModal = (safari) => {
    setEditingSafari({
      ...safari,
      primary_image: formatImageUrl(safari.primary_image)
    });
    setSafariModalOpen(true);
  };

  const saveSafari = async (e) => {
    e.preventDefault();
    setSafariSaving(true);
    try {
      const payload = {
        ...editingSafari,
        primary_image: formatImageUrl(editingSafari.primary_image)
      };

      let res;
      if (editingSafari.id) {
        res = await fetch(`/api/safaris/${editingSafari.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/safaris', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save Jeep Safari');

      showNotice('success', editingSafari.id ? 'Jeep Safari updated!' : 'Jeep Safari created!');
      setSafariModalOpen(false);
      await loadAllData();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setSafariSaving(false);
    }
  };

  const deleteSafari = async (id, title) => {
    if (!confirm(`Are you sure you want to delete safari: "${title}"?`)) return;
    setDeletingId(`safari-${id}`);
    try {
      const res = await fetch(`/api/safaris/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete safari');
      showNotice('success', 'Jeep Safari trail deleted');
      await loadAllData();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  /* ==========================================================================
     TOUR PACKAGES MANAGEMENT HANDLERS
     ========================================================================== */
  const openCreatePackageModal = () => {
    setEditingPackage({
      id: null,
      title: '',
      subtitle: '',
      badge: '🔥 Special Offer',
      duration: '1 Night / 2 Days',
      price: 2000,
      show_price: true,
      price_basis: 'Per Person (Per Head)',
      destinations: 'Marayoor & Kanthalloor',
      image: '/assets/images/dest_kanthaloor.jpg',
      poster_image: '/assets/images/poster_master_offers.jpg',
      inclusionsText: 'Homely Breakfast & Dinner\nComfortable Nature Stay\nNight Campfire with Music\n4x4 Jeep Safari Ride',
      exclusionsText: 'Personal expenses\nForest entry tickets',
      group_note: 'Children below 5 yrs FREE. Dates subject to confirmation.'
    });
    setPackageModalOpen(true);
  };

  const openEditPackageModal = (pkg) => {
    setEditingPackage({
      ...pkg,
      image: formatImageUrl(pkg.image),
      poster_image: pkg.poster_image ? formatImageUrl(pkg.poster_image) : '',
      inclusionsText: Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : '',
      exclusionsText: Array.isArray(pkg.exclusions) ? pkg.exclusions.join('\n') : ''
    });
    setPackageModalOpen(true);
  };

  const savePackage = async (e) => {
    e.preventDefault();
    setPackageSaving(true);
    const inclusions = editingPackage.inclusionsText.split('\n').map(s => s.trim()).filter(Boolean);
    const exclusions = editingPackage.exclusionsText.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      title: editingPackage.title,
      subtitle: editingPackage.subtitle,
      badge: editingPackage.badge,
      duration: editingPackage.duration,
      price: parseInt(editingPackage.price, 10) || 0,
      show_price: Boolean(editingPackage.show_price),
      price_basis: editingPackage.price_basis,
      destinations: editingPackage.destinations,
      image: formatImageUrl(editingPackage.image),
      poster_image: editingPackage.poster_image ? formatImageUrl(editingPackage.poster_image) : null,
      inclusions,
      exclusions,
      group_note: editingPackage.group_note
    };

    try {
      let res;
      if (editingPackage.id) {
        res = await fetch(`/api/packages/${editingPackage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save package');

      showNotice('success', editingPackage.id ? 'Package updated!' : 'Package created!');
      setPackageModalOpen(false);
      await loadAllData();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setPackageSaving(false);
    }
  };

  const deletePackage = async (id, title) => {
    if (!confirm(`Are you sure you want to delete tour package: "${title}"?`)) return;
    setDeletingId(`pkg-${id}`);
    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete package');
      showNotice('success', 'Tour Package deleted');
      await loadAllData();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  /* ==========================================================================
     ADMIN CREDENTIALS & SEEDER
     ========================================================================== */
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (credForm.newPassword && credForm.newPassword !== credForm.confirmPassword) {
      showNotice('error', 'New passwords do not match');
      return;
    }

    setCredLoading(true);
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: credForm.currentPassword,
          newUsername: credForm.newUsername || undefined,
          newPassword: credForm.newPassword || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials');

      showNotice('success', 'Admin credentials updated successfully!');
      setCredForm({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
      fetchAdminStatus();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setCredLoading(false);
    }
  };

  const handleRunSeeder = async () => {
    if (!confirm('Are you sure you want to re-sync all default rooms, safaris, packages, and gallery data? Existing custom records will remain.')) {
      return;
    }

    setSeederLoading(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Seeder failed');
      showNotice('success', 'Default database records re-synced successfully!');
      loadAllData();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setSeederLoading(false);
    }
  };

  /* ==========================================================================
     REUSABLE LIVE IMAGE PREVIEW & UPLOAD COMPONENT
     ========================================================================== */
  const ImageUploadWithPreview = ({ label, value, onChange, folder = 'rooms' }) => {
    const formattedUrl = formatImageUrl(value);
    const [imgValid, setImgValid] = useState(true);
    const [fieldUploading, setFieldUploading] = useState(false);

    return (
      <div className="admin-form-group">
        <label>{label}</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            className="admin-input"
            value={value || ''}
            disabled={fieldUploading}
            onChange={(e) => {
              setImgValid(true);
              onChange(e.target.value);
            }}
            placeholder="/assets/images/... or /uploads/..."
          />
          <label
            className="admin-btn admin-btn-secondary"
            style={{
              cursor: fieldUploading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              opacity: fieldUploading ? 0.7 : 1
            }}
          >
            {fieldUploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-upload"></i>}
            <span>{fieldUploading ? 'Uploading...' : 'Choose File'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={fieldUploading}
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFieldUploading(true);
                  try {
                    const url = await uploadImageFile(file, folder);
                    if (url) {
                      setImgValid(true);
                      onChange(url);
                    }
                  } finally {
                    setFieldUploading(false);
                  }
                }
              }}
            />
          </label>
        </div>

        {/* Live Interactive Preview Box */}
        {value && (
          <div className="admin-img-preview-box">
            <div
              className="admin-img-preview-thumb-wrap"
              onClick={() => setPreviewModal({ src: formattedUrl, title: label })}
              title="Click to inspect full size image"
            >
              <img
                src={formattedUrl}
                alt="Preview"
                onLoad={() => setImgValid(true)}
                onError={() => setImgValid(false)}
              />
              <div className="admin-img-preview-thumb-overlay">
                <i className="fas fa-search-plus"></i>
              </div>
            </div>

            <div className="admin-img-preview-info">
              <span className="admin-img-preview-path">{value}</span>
              <div className={`admin-img-preview-status ${imgValid ? 'ok' : 'error'}`}>
                <i className={imgValid ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'}></i>
                <span>{imgValid ? 'Valid Image (Ready to display)' : 'Broken / Missing image URL'}</span>
              </div>
            </div>

            <div className="admin-img-preview-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                onClick={() => setPreviewModal({ src: formattedUrl, title: label })}
                title="Full Preview"
              >
                <i className="fas fa-expand"></i> Preview
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                onClick={() => onChange('')}
                title="Clear image"
              >
                <i className="fas fa-times"></i> Clear
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme === 'dark' ? '#0a130e' : '#f8fafc',
        color: '#22c55e'
      }}>
        <i className="fas fa-spinner fa-spin fa-3x"></i>
      </div>
    );
  }

  return (
    <div className="admin-body" data-theme={theme}>
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header-title">
          <img src="/assets/images/logo_tight.jpg" alt="Logo" style={{ height: '36px', borderRadius: '6px' }} />
          <span>Manoj Tours & Travels — Admin Control Center</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Day / Night Theme Switcher for Admin */}
          <button
            type="button"
            onClick={toggleTheme}
            className="admin-btn admin-btn-secondary"
            title={theme === 'dark' ? 'Switch to Day Mode (Light)' : 'Switch to Night Mode (Dark)'}
            style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
            User: <strong style={{ color: 'var(--admin-text-accent)' }}>{adminUser?.username || 'admin'}</strong>
          </span>

          <a
            href="/"
            target="_blank"
            className="admin-btn admin-btn-secondary"
            title="Open Public Website in new tab"
          >
            <i className="fas fa-external-link-alt"></i> Website
          </a>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="admin-btn admin-btn-danger"
            title="Sign out from admin session"
          >
            <i className={loggingOut ? "fas fa-spinner fa-spin" : "fas fa-sign-out-alt"}></i>
            <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="admin-nav-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          <i className="fas fa-bed"></i> Rooms & Stays ({rooms.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'safaris' ? 'active' : ''}`}
          onClick={() => setActiveTab('safaris')}
        >
          <i className="fas fa-truck-monster"></i> Jeep Safari Trails ({safaris.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
          onClick={() => setActiveTab('packages')}
        >
          <i className="fas fa-gift"></i> Tour Packages ({packages.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <i className="fas fa-cog"></i> Account & Database Seeder
        </button>
      </nav>

      {/* Notification Toast */}
      {notification.message && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 1000,
          background: notification.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(34, 197, 94, 0.95)',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <i className={notification.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'}></i>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="admin-main">
        {/* ====================================================================
            TAB 1: ROOMS & STAYS CRUD
            ==================================================================== */}
        {activeTab === 'rooms' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--admin-text-accent)', fontFamily: "'Outfit', sans-serif" }}>
                  Manage Rooms & Nature Stays
                </h2>
                <small style={{ color: 'var(--admin-text-muted)' }}>
                  Add, edit pricing, toggle "Contact for rates", manage River House, and upload multi-photo galleries with live preview.
                </small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => loadAllData()}
                  disabled={dataRefreshing}
                  className="admin-btn admin-btn-secondary"
                  title="Refresh rooms from database"
                >
                  <i className={`fas fa-sync-alt ${dataRefreshing ? 'fa-spin' : ''}`}></i>
                  <span>{dataRefreshing ? 'Syncing...' : 'Refresh'}</span>
                </button>
                <button onClick={openCreateRoomModal} className="admin-btn admin-btn-primary">
                  <i className="fas fa-plus"></i> Add New Room
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Room Name</th>
                    <th>Category</th>
                    <th>Price / Night</th>
                    <th>Occupancy</th>
                    <th>Location</th>
                    <th>Photos</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room.id}>
                      <td style={{ width: '80px' }}>
                        <div
                          className="admin-img-preview-thumb-wrap"
                          style={{ width: '70px', height: '48px' }}
                          onClick={() => setPreviewModal({ src: formatImageUrl(room.primary_image), title: room.name })}
                          title="Click to view full image"
                        >
                          <img
                            src={formatImageUrl(room.primary_image)}
                            alt={room.name}
                            onError={(e) => { e.currentTarget.src = '/assets/images/hero_client_jeep.jpg'; }}
                          />
                          <div className="admin-img-preview-thumb-overlay" style={{ fontSize: '0.8rem' }}>
                            <i className="fas fa-search-plus"></i>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{room.name}</strong>
                        {room.category === 'river' && (
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#0284c7' }}>
                            <i className="fas fa-water"></i> River House Stay
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{
                          background: 'var(--admin-badge-bg)',
                          color: 'var(--admin-badge-text)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          fontWeight: 700
                        }}>
                          {room.category}
                        </span>
                      </td>
                      <td>
                        {room.show_price ? (
                          <span style={{ color: '#eab308', fontWeight: 700 }}>₹{room.price?.toLocaleString('en-IN')}</span>
                        ) : (
                          <span style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>Contact for rates</span>
                        )}
                      </td>
                      <td>{room.capacity}</td>
                      <td><small>{room.location}</small></td>
                      <td>
                        <button
                          onClick={() => openImageManager(room)}
                          className="admin-btn admin-btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                          title="Manage gallery images"
                        >
                          <i className="fas fa-images"></i> {room.gallery?.length || 1} Photos
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => openEditRoomModal(room)}
                            disabled={deletingId === `room-${room.id}`}
                            className="admin-btn admin-btn-edit"
                            title="Edit Room Details"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => deleteRoom(room.id, room.name)}
                            disabled={deletingId === `room-${room.id}`}
                            className="admin-btn admin-btn-danger"
                            title="Delete Room"
                          >
                            {deletingId === `room-${room.id}` ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: JEEP SAFARIS CRUD
            ==================================================================== */}
        {activeTab === 'safaris' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--admin-text-accent)', fontFamily: "'Outfit', sans-serif" }}>
                  Manage Jeep Safari Trails & Highlights
                </h2>
                <small style={{ color: 'var(--admin-text-muted)' }}>
                  Manage all 10 official safari trails (Muruganpara, Bhramaram, Irachilpara, Anakulam Elephants, Sandalwood walk, etc.).
                </small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => loadAllData()}
                  disabled={dataRefreshing}
                  className="admin-btn admin-btn-secondary"
                  title="Refresh safaris from database"
                >
                  <i className={`fas fa-sync-alt ${dataRefreshing ? 'fa-spin' : ''}`}></i>
                  <span>{dataRefreshing ? 'Syncing...' : 'Refresh'}</span>
                </button>
                <button onClick={openCreateSafariModal} className="admin-btn admin-btn-primary">
                  <i className="fas fa-plus"></i> Add New Safari Trail
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Trail Title</th>
                    <th>Badge</th>
                    <th>Duration</th>
                    <th>Terrain / Type</th>
                    <th>Rate Info</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {safaris.map(s => (
                    <tr key={s.id}>
                      <td style={{ width: '80px' }}>
                        <div
                          className="admin-img-preview-thumb-wrap"
                          style={{ width: '70px', height: '48px' }}
                          onClick={() => setPreviewModal({ src: formatImageUrl(s.primary_image), title: s.title })}
                          title="Click to view full image"
                        >
                          <img
                            src={formatImageUrl(s.primary_image)}
                            alt={s.title}
                            onError={(e) => { e.currentTarget.src = '/assets/images/hero_client_jeep.jpg'; }}
                          />
                          <div className="admin-img-preview-thumb-overlay" style={{ fontSize: '0.8rem' }}>
                            <i className="fas fa-search-plus"></i>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{s.title}</strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--admin-text-muted)', maxWidth: '300px' }}>
                          {s.description.slice(0, 75)}...
                        </p>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', background: 'var(--admin-btn-sec-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {s.badge}
                        </span>
                      </td>
                      <td><small>{s.duration}</small></td>
                      <td><small>{s.terrain_tag}</small></td>
                      <td><small style={{ color: '#eab308', fontWeight: 600 }}>{s.price_info}</small></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => openEditSafariModal(s)}
                            disabled={deletingId === `safari-${s.id}`}
                            className="admin-btn admin-btn-edit"
                            title="Edit Safari Trail"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => deleteSafari(s.id, s.title)}
                            disabled={deletingId === `safari-${s.id}`}
                            className="admin-btn admin-btn-danger"
                            title="Delete Safari"
                          >
                            {deletingId === `safari-${s.id}` ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: TOUR PACKAGES CRUD
            ==================================================================== */}
        {activeTab === 'packages' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--admin-text-accent)', fontFamily: "'Outfit', sans-serif" }}>
                  Manage Tour Packages & Posters
                </h2>
                <small style={{ color: 'var(--admin-text-muted)' }}>
                  Manage prices, inclusions, duration, cover photos, and poster preview images for all packages.
                </small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => loadAllData()}
                  disabled={dataRefreshing}
                  className="admin-btn admin-btn-secondary"
                  title="Refresh packages from database"
                >
                  <i className={`fas fa-sync-alt ${dataRefreshing ? 'fa-spin' : ''}`}></i>
                  <span>{dataRefreshing ? 'Syncing...' : 'Refresh'}</span>
                </button>
                <button onClick={openCreatePackageModal} className="admin-btn admin-btn-primary">
                  <i className="fas fa-plus"></i> Add New Package
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Package Title</th>
                    <th>Badge</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Destinations</th>
                    <th>Poster</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map(pkg => (
                    <tr key={pkg.id}>
                      <td style={{ width: '80px' }}>
                        <div
                          className="admin-img-preview-thumb-wrap"
                          style={{ width: '70px', height: '48px' }}
                          onClick={() => setPreviewModal({ src: formatImageUrl(pkg.image), title: pkg.title })}
                          title="Click to view full cover image"
                        >
                          <img
                            src={formatImageUrl(pkg.image)}
                            alt={pkg.title}
                            onError={(e) => { e.currentTarget.src = '/assets/images/hero_client_jeep.jpg'; }}
                          />
                          <div className="admin-img-preview-thumb-overlay" style={{ fontSize: '0.8rem' }}>
                            <i className="fas fa-search-plus"></i>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{pkg.title}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{pkg.subtitle}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(234, 179, 8, 0.15)', color: '#ca8a04', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {pkg.badge}
                        </span>
                      </td>
                      <td><small>{pkg.duration}</small></td>
                      <td>
                        {pkg.show_price ? (
                          <span style={{ color: 'var(--admin-text-accent)', fontWeight: 700 }}>₹{pkg.price?.toLocaleString('en-IN')}</span>
                        ) : (
                          <span style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>Custom Quote</span>
                        )}
                      </td>
                      <td><small>{pkg.destinations}</small></td>
                      <td>
                        {pkg.poster_image ? (
                          <button
                            type="button"
                            onClick={() => setPreviewModal({ src: formatImageUrl(pkg.poster_image), title: `${pkg.title} - Official Poster` })}
                            className="admin-btn admin-btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                            title="Preview Poster Full Size"
                          >
                            <i className="fas fa-image"></i> Poster
                          </button>
                        ) : (
                          <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>None</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => openEditPackageModal(pkg)}
                            disabled={deletingId === `pkg-${pkg.id}`}
                            className="admin-btn admin-btn-edit"
                            title="Edit Package"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => deletePackage(pkg.id, pkg.title)}
                            disabled={deletingId === `pkg-${pkg.id}`}
                            className="admin-btn admin-btn-danger"
                            title="Delete Package"
                          >
                            {deletingId === `pkg-${pkg.id}` ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: ADMIN CREDENTIALS & DATABASE SEEDER
            ==================================================================== */}
        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            {/* Update Credentials Card */}
            <div className="admin-card">
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: 'var(--admin-text-accent)', fontFamily: "'Outfit', sans-serif" }}>
                <i className="fas fa-user-shield"></i> Admin Account Settings
              </h2>
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Change your admin username and password. Changes take effect immediately and are securely hashed with bcrypt in the MySQL database.
              </p>

              <form onSubmit={handleUpdateCredentials}>
                <div className="admin-form-group">
                  <label>Current Password (Required for any changes):</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    className="admin-input"
                    value={credForm.currentPassword}
                    onChange={e => setCredForm({ ...credForm, currentPassword: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>New Username (Optional):</label>
                  <input
                    type="text"
                    placeholder={`Leave blank to keep "${adminUser?.username || 'admin'}"`}
                    className="admin-input"
                    value={credForm.newUsername}
                    onChange={e => setCredForm({ ...credForm, newUsername: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>New Password (Optional):</label>
                  <input
                    type="password"
                    placeholder="Enter at least 6 characters"
                    className="admin-input"
                    value={credForm.newPassword}
                    onChange={e => setCredForm({ ...credForm, newPassword: e.target.value })}
                  />
                </div>

                {credForm.newPassword && (
                  <div className="admin-form-group">
                    <label>Confirm New Password:</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      className="admin-input"
                      value={credForm.confirmPassword}
                      onChange={e => setCredForm({ ...credForm, confirmPassword: e.target.value })}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={credLoading}
                  className="admin-btn admin-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                >
                  {credLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                  <span>{credLoading ? 'Updating Credentials...' : 'Save Admin Credentials'}</span>
                </button>
              </form>
            </div>

            {/* Database Seeder Control */}
            <div className="admin-card">
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#eab308', fontFamily: "'Outfit', sans-serif" }}>
                <i className="fas fa-database"></i> Database Seeder Control
              </h2>
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Use this option to re-sync or restore any missing default rooms (including the River House), 10 Jeep Safari trails, 10 tour packages, 14 destinations, and gallery photos into the MySQL <code style={{ color: 'var(--admin-text-accent)' }}>Manoj</code> database.
              </p>

              <div style={{
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                fontSize: '0.825rem',
                color: 'var(--admin-text-sub)'
              }}>
                <i className="fas fa-info-circle"></i> <strong>Safe Re-Sync:</strong> Existing items with identical slugs will not be overwritten. New or missing default records will be seeded.
              </div>

              <button
                type="button"
                disabled={seederLoading}
                onClick={handleRunSeeder}
                className="admin-btn admin-btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  color: '#eab308'
                }}
              >
                {seederLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sync-alt"></i>}
                <span>{seederLoading ? 'Running Database Seeder...' : 'Re-sync / Run Default Seeder'}</span>
              </button>

              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--admin-border-subtle)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>Current Database:</strong> MySQL (Port 3306)</p>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>Database Name:</strong> Manoj</p>
                <p style={{ margin: 0 }}><strong>Upload Storage:</strong> /public/uploads/ (Local + Hostinger ready)</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          MODAL: CREATE / EDIT ROOM (WITH LIVE IMAGE PREVIEW)
          ==================================================================== */}
      {roomModalOpen && editingRoom && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: 'var(--admin-text-accent)', fontSize: '1.2rem' }}>
                {editingRoom.id ? 'Edit Room / Stay' : 'Add New Room / Nature Stay'}
              </h3>
              <button
                type="button"
                disabled={roomSaving}
                onClick={() => setRoomModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', fontSize: '1.25rem', cursor: roomSaving ? 'not-allowed' : 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={saveRoom}>
              <div className="admin-form-group">
                <label>Room Name *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={editingRoom.name}
                  onChange={e => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  placeholder="e.g. Riverside Cottage / River House (Rooms Near the River)"
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label>Category *</label>
                  <select
                    className="admin-select"
                    value={editingRoom.category}
                    onChange={e => setEditingRoom({ ...editingRoom, category: e.target.value })}
                  >
                    <option value="river">River House / Near the River</option>
                    <option value="deluxe">Deluxe / Standard Room</option>
                    <option value="family">Family Room / Suite</option>
                    <option value="pool">Swimming Pool Property</option>
                    <option value="cottage">Cottage / Wooden Villa</option>
                    <option value="jungle">Jungle Stay</option>
                    <option value="aframe">A-Frame Cottage</option>
                    <option value="tent">Tent Stay / Camping</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Price (₹ per night)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={editingRoom.price}
                    onChange={e => setEditingRoom({ ...editingRoom, price: e.target.value })}
                    placeholder="3500"
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editingRoom.show_price}
                      onChange={e => setEditingRoom({ ...editingRoom, show_price: e.target.checked })}
                    />
                    <span>Show numeric price (Uncheck for "Contact for rates")</span>
                  </label>
                </div>

                <div className="admin-form-group">
                  <label>Price Basis</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingRoom.price_basis}
                    onChange={e => setEditingRoom({ ...editingRoom, price_basis: e.target.value })}
                    placeholder="Per Room / Per Night"
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label>Occupancy Capacity *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingRoom.capacity}
                    onChange={e => setEditingRoom({ ...editingRoom, capacity: e.target.value })}
                    placeholder="2 - 4 Adults"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Location / View *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingRoom.location}
                    onChange={e => setEditingRoom({ ...editingRoom, location: e.target.value })}
                    placeholder="Near the River, Marayoor / Anakulam"
                  />
                </div>
              </div>

              {/* Primary Image with Live Interactive Preview */}
              <ImageUploadWithPreview
                label="Primary Cover Photo *"
                value={editingRoom.primary_image}
                onChange={(newUrl) => setEditingRoom({ ...editingRoom, primary_image: newUrl })}
                folder="rooms"
              />

              <div className="admin-form-group">
                <label>Room Amenities & Features (1 per line)</label>
                <textarea
                  rows={4}
                  className="admin-textarea"
                  value={editingRoom.featuresText}
                  onChange={e => setEditingRoom({ ...editingRoom, featuresText: e.target.value })}
                  placeholder="Rooms Near the River with soothing natural river breeze&#10;Riverside sit-out veranda&#10;Campfire area"
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label>Dining Note</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingRoom.dining_note}
                  onChange={e => setEditingRoom({ ...editingRoom, dining_note: e.target.value })}
                  placeholder="Homely Kerala breakfast & dinner available on order."
                />
              </div>

              <div className="admin-form-group">
                <label>Policy & Disclaimer Note</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingRoom.disclaimer}
                  onChange={e => setEditingRoom({ ...editingRoom, disclaimer: e.target.value })}
                  placeholder="Price Basis: Per Room / Per Night. Waterfront property."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  disabled={roomSaving}
                  onClick={() => setRoomModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roomSaving}
                  className="admin-btn admin-btn-primary"
                  style={{ minWidth: '140px', justifyContent: 'center' }}
                >
                  {roomSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                  <span>{roomSaving ? (editingRoom.id ? 'Updating Room...' : 'Creating Room...') : (editingRoom.id ? 'Update Room' : 'Save Room')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: ROOM MULTI-IMAGE GALLERY MANAGER (WITH FULL PREVIEW)
          ==================================================================== */}
      {roomImageManagerOpen && activeRoomForImages && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--admin-text-accent)', fontSize: '1.2rem' }}>
                  Manage Gallery Photos — {activeRoomForImages.name}
                </h3>
                <small style={{ color: 'var(--admin-text-muted)' }}>
                  Add multiple photos, set the primary card image, or click any photo to inspect it full size.
                </small>
              </div>
              <button
                type="button"
                disabled={galleryUploading || galleryActionId !== null}
                onClick={() => setRoomImageManagerOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', fontSize: '1.25rem', cursor: (galleryUploading || galleryActionId !== null) ? 'not-allowed' : 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Upload New Image */}
            <div style={{
              background: 'var(--admin-img-preview-bg)',
              border: '2px dashed var(--admin-card-border)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--admin-text-main)' }}>
                Upload new high-resolution photo for this room from your computer or phone:
              </p>
              <label
                className="admin-btn admin-btn-primary"
                style={{
                  cursor: galleryUploading ? 'not-allowed' : 'pointer',
                  opacity: galleryUploading ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className={galleryUploading ? "fas fa-spinner fa-spin" : "fas fa-cloud-upload-alt"}></i>
                <span>{galleryUploading ? 'Uploading & Saving to Room...' : 'Select & Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={galleryUploading}
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAddRoomImage(file);
                  }}
                />
              </label>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                Supported: JPG, PNG, WebP (Up to 10MB)
              </div>
            </div>

            {/* Existing Images Grid with Click-to-Inspect */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '1rem',
              maxHeight: '420px',
              overflowY: 'auto',
              padding: '0.5rem'
            }}>
              {activeRoomForImages.room_images && activeRoomForImages.room_images.length > 0 ? (
                activeRoomForImages.room_images.map((img) => (
                  <div
                    key={img.id}
                    style={{
                      background: 'var(--admin-card-bg)',
                      border: img.is_primary ? '2px solid var(--admin-text-accent)' : '1px solid var(--admin-card-border)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: 'var(--admin-card-shadow)'
                    }}
                  >
                    <div
                      className="admin-img-preview-thumb-wrap"
                      style={{ width: '100%', height: '115px' }}
                      onClick={() => setPreviewModal({ src: formatImageUrl(img.image_url), title: `${activeRoomForImages.name} - Photo` })}
                      title="Click to view full size photo"
                    >
                      <img
                        src={formatImageUrl(img.image_url)}
                        alt="Room"
                        onError={(e) => { e.currentTarget.src = '/assets/images/hero_client_jeep.jpg'; }}
                      />
                      <div className="admin-img-preview-thumb-overlay">
                        <i className="fas fa-search-plus"></i>
                      </div>
                    </div>

                    {img.is_primary && (
                      <span style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        background: '#22c55e',
                        color: '#0c1511',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                      }}>
                        PRIMARY
                      </span>
                    )}

                    <div style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between', gap: '0.25rem', alignItems: 'center' }}>
                      {!img.is_primary ? (
                        <button
                          type="button"
                          disabled={galleryActionId !== null || galleryUploading}
                          onClick={() => handleSetPrimaryImage(img.id, img.image_url)}
                          className="admin-btn admin-btn-secondary"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                          title="Set as Primary"
                        >
                          {galleryActionId === `primary-${img.id}` ? <i className="fas fa-spinner fa-spin"></i> : null}
                          <span>{galleryActionId === `primary-${img.id}` ? 'Setting...' : 'Make Primary'}</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-accent)', fontWeight: 700 }}>Cover Photo</span>
                      )}
                      <button
                        type="button"
                        disabled={galleryActionId !== null || galleryUploading}
                        onClick={() => handleDeleteRoomImage(img.id)}
                        className="admin-btn admin-btn-danger"
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                        title="Delete photo"
                      >
                        {galleryActionId === `del-${img.id}` ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                  No extra images uploaded yet. Primary cover photo: <br />
                  <code style={{ color: 'var(--admin-text-accent)' }}>{activeRoomForImages.primary_image}</code>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button
                type="button"
                disabled={galleryUploading || galleryActionId !== null}
                onClick={() => setRoomImageManagerOpen(false)}
                className="admin-btn admin-btn-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: CREATE / EDIT JEEP SAFARI (WITH LIVE IMAGE PREVIEW)
          ==================================================================== */}
      {safariModalOpen && editingSafari && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: 'var(--admin-text-accent)', fontSize: '1.2rem' }}>
                {editingSafari.id ? 'Edit Jeep Safari Trail' : 'Add New Jeep Safari Trail'}
              </h3>
              <button
                type="button"
                disabled={safariSaving}
                onClick={() => setSafariModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', fontSize: '1.25rem', cursor: safariSaving ? 'not-allowed' : 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={saveSafari}>
              <div className="admin-form-group">
                <label>Safari Trail Title *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={editingSafari.title}
                  onChange={e => setEditingSafari({ ...editingSafari, title: e.target.value })}
                  placeholder="e.g. Irachilpara & Kacharam Waterfalls Trail"
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label>Badge *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingSafari.badge}
                    onChange={e => setEditingSafari({ ...editingSafari, badge: e.target.value })}
                    placeholder="🌊 Waterfall Trail"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Duration *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingSafari.duration}
                    onChange={e => setEditingSafari({ ...editingSafari, duration: e.target.value })}
                    placeholder="3 - 4 Hours"
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label>Terrain / Feature Tag *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingSafari.terrain_tag}
                    onChange={e => setEditingSafari({ ...editingSafari, terrain_tag: e.target.value })}
                    placeholder="Natural Cascades"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Fee Basis / Price Note</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingSafari.price_info}
                    onChange={e => setEditingSafari({ ...editingSafari, price_info: e.target.value })}
                    placeholder="₹2,500 – ₹3,500 per Jeep"
                  />
                </div>
              </div>

              {/* Safari Trail Image with Live Interactive Preview */}
              <ImageUploadWithPreview
                label="Trail Cover Photo *"
                value={editingSafari.primary_image}
                onChange={(newUrl) => setEditingSafari({ ...editingSafari, primary_image: newUrl })}
                folder="safaris"
              />

              <div className="admin-form-group">
                <label>Short Description *</label>
                <textarea
                  rows={3}
                  required
                  className="admin-textarea"
                  value={editingSafari.description}
                  onChange={e => setEditingSafari({ ...editingSafari, description: e.target.value })}
                  placeholder="Describe the adventure, viewpoint, waterfalls or wildlife sighting..."
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label>Weather & Forest Rules Note</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingSafari.weather_note}
                  onChange={e => setEditingSafari({ ...editingSafari, weather_note: e.target.value })}
                  placeholder="Routes subject to weather and forest rules."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  disabled={safariSaving}
                  onClick={() => setSafariModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={safariSaving}
                  className="admin-btn admin-btn-primary"
                  style={{ minWidth: '160px', justifyContent: 'center' }}
                >
                  {safariSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                  <span>{safariSaving ? (editingSafari.id ? 'Updating Safari...' : 'Creating Safari...') : (editingSafari.id ? 'Update Safari Trail' : 'Save Safari Trail')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: CREATE / EDIT PACKAGE (WITH LIVE PREVIEWS FOR COVER & POSTER)
          ==================================================================== */}
      {packageModalOpen && editingPackage && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: 'var(--admin-text-accent)', fontSize: '1.2rem' }}>
                {editingPackage.id ? 'Edit Tour Package' : 'Add New Tour Package'}
              </h3>
              <button
                type="button"
                disabled={packageSaving}
                onClick={() => setPackageModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', fontSize: '1.25rem', cursor: packageSaving ? 'not-allowed' : 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={savePackage}>
              <div className="admin-form-group">
                <label>Package Title *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={editingPackage.title}
                  onChange={e => setEditingPackage({ ...editingPackage, title: e.target.value })}
                  placeholder="e.g. Marayoor & Kanthalloor One Day Trip"
                />
              </div>

              <div className="admin-form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingPackage.subtitle}
                  onChange={e => setEditingPackage({ ...editingPackage, subtitle: e.target.value })}
                  placeholder="Nature • Adventure • Relaxation"
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label>Badge *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingPackage.badge}
                    onChange={e => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                    placeholder="🔥 Special Offer ₹1,500"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Duration *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingPackage.duration}
                    onChange={e => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                    placeholder="1 Night / 2 Days"
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label>Price (₹ per person)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={editingPackage.price}
                    onChange={e => setEditingPackage({ ...editingPackage, price: e.target.value })}
                    placeholder="1500"
                  />
                </div>

                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.75rem' }}>
                    <input
                      type="checkbox"
                      checked={editingPackage.show_price}
                      onChange={e => setEditingPackage({ ...editingPackage, show_price: e.target.checked })}
                    />
                    <span>Show numeric price</span>
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Destinations Covered</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingPackage.destinations}
                  onChange={e => setEditingPackage({ ...editingPackage, destinations: e.target.value })}
                  placeholder="Marayoor, Kanthalloor & Munnar"
                />
              </div>

              {/* Package Cover Image with Live Preview */}
              <ImageUploadWithPreview
                label="Package Card Cover Photo"
                value={editingPackage.image}
                onChange={(newUrl) => setEditingPackage({ ...editingPackage, image: newUrl })}
                folder="packages"
              />

              {/* Official Poster Image with Live Preview */}
              <ImageUploadWithPreview
                label="Official Poster Image (For Lightbox Preview)"
                value={editingPackage.poster_image}
                onChange={(newUrl) => setEditingPackage({ ...editingPackage, poster_image: newUrl })}
                folder="packages"
              />

              <div className="admin-form-group">
                <label>Inclusions (1 per line)</label>
                <textarea
                  rows={4}
                  className="admin-textarea"
                  value={editingPackage.inclusionsText}
                  onChange={e => setEditingPackage({ ...editingPackage, inclusionsText: e.target.value })}
                  placeholder="Homely Food (Breakfast & Dinner)&#10;Comfortable Nature Stay&#10;Campfire with Music&#10;4x4 Off-Road Jeep Safari"
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label>Exclusions (1 per line)</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  value={editingPackage.exclusionsText}
                  onChange={e => setEditingPackage({ ...editingPackage, exclusionsText: e.target.value })}
                  placeholder="Personal expenses&#10;Sightseeing entry tickets"
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label>Group & Family Note</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingPackage.group_note}
                  onChange={e => setEditingPackage({ ...editingPackage, group_note: e.target.value })}
                  placeholder="Children below 5 yrs FREE. Minimum group size applies."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  disabled={packageSaving}
                  onClick={() => setPackageModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={packageSaving}
                  className="admin-btn admin-btn-primary"
                  style={{ minWidth: '150px', justifyContent: 'center' }}
                >
                  {packageSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                  <span>{packageSaving ? (editingPackage.id ? 'Updating Package...' : 'Creating Package...') : (editingPackage.id ? 'Update Package' : 'Save Package')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          ADMIN FULL-SIZE IMAGE PREVIEW LIGHTBOX MODAL
          ==================================================================== */}
      {previewModal && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setPreviewModal(null)}
          style={{ zIndex: 1100 }}
        >
          <div
            className="admin-modal"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '900px', padding: '1rem', background: 'var(--admin-modal-bg)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--admin-card-border)' }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--admin-text-accent)' }}>{previewModal.title || 'Image Preview'}</h4>
                <small style={{ color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>{previewModal.src}</small>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{
              maxHeight: '75vh',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#000000',
              borderRadius: '8px'
            }}>
              <img
                src={previewModal.src}
                alt={previewModal.title || 'Preview'}
                style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.src = '/assets/images/hero_client_jeep.jpg'; }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                Tip: Click outside or the &times; button to close preview.
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(previewModal.src);
                  showNotice('success', 'Image path copied to clipboard!');
                }}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                <i className="fas fa-copy"></i> Copy Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
