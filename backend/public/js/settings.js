document.addEventListener('DOMContentLoaded', function() {
    
    const settingsForm = document.getElementById('settings-form');
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsSections = document.querySelectorAll('.settings-section');
    const saveButton = document.getElementById('save-settings');
    const notification = document.getElementById('notification');
    
    
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    
    if (!token || !user.name) {
        window.location.href = '/login?redirect=settings';
        return;
    }
    
    
    loadUserData();
    
    
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            
            settingsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            
            settingsSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${tabId}-settings`) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    
    settingsForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        
        const activeTab = document.querySelector('.settings-tab.active').getAttribute('data-tab');
        
        try {
            saveButton.disabled = true;
            saveButton.textContent = 'Saving...';
            
            switch(activeTab) {
                case 'profile':
                    await saveProfileSettings();
                    break;
                case 'security':
                    await saveSecuritySettings();
                    break;
                case 'notifications':
                    await saveNotificationSettings();
                    break;
                case 'privacy':
                    await savePrivacySettings();
                    break;
            }
            
            showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            showNotification(error.message || 'Failed to save settings', 'error');
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = 'Save Changes';
        }
    });
    
    
    async function loadUserData() {
        try {
            
            document.getElementById('name').value = user.name || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('location').value = user.location || '';
            
            
            const response = await fetch('/api/users/settings', {
                headers: {
                    'x-auth-token': token
                }
            });
            
            if (response.ok) {
                const settings = await response.json();
                
                
                if (settings.notifications) {
                    document.getElementById('email-notifications').checked = settings.notifications.email;
                    document.getElementById('product-updates').checked = settings.notifications.productUpdates;
                    document.getElementById('messages-notifications').checked = settings.notifications.messages;
                    document.getElementById('marketing-emails').checked = settings.notifications.marketing;
                }
                
                
                if (settings.privacy) {
                    document.getElementById('profile-visibility').checked = settings.privacy.profileVisibility;
                    document.getElementById('contact-info-visibility').checked = settings.privacy.contactInfoVisibility;
                    document.getElementById('activity-tracking').checked = settings.privacy.activityTracking;
                }
                
                
                if (settings.security) {
                    document.getElementById('two-factor').checked = settings.security.twoFactor;
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            showNotification('Failed to load user settings', 'error');
        }
    }
    
    
    async function saveProfileSettings() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const location = document.getElementById('location').value;
        
        
        if (!name) {
            throw new Error('Name is required');
        }
        
        
        user.name = name;
        user.phone = phone;
        user.location = location;
        localStorage.setItem('user', JSON.stringify(user));
        
        
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                name,
                phone,
                location
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || 'Failed to update profile');
        }
    }
    
    
    async function saveSecuritySettings() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const twoFactor = document.getElementById('two-factor').checked;
        
        
        if (newPassword) {
            if (!currentPassword) {
                throw new Error('Current password is required');
            }
            
            if (newPassword !== confirmPassword) {
                throw new Error('New passwords do not match');
            }
            
            if (newPassword.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }
            
            
            const response = await fetch('/api/users/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg || 'Failed to update password');
            }
            
            
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        }
        
        
        const tfaResponse = await fetch('/api/users/security', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                twoFactor
            })
        });
        
        if (!tfaResponse.ok) {
            const error = await tfaResponse.json();
            throw new Error(error.msg || 'Failed to update security settings');
        }
    }
    
    
    async function saveNotificationSettings() {
        const settings = {
            email: document.getElementById('email-notifications').checked,
            productUpdates: document.getElementById('product-updates').checked,
            messages: document.getElementById('messages-notifications').checked,
            marketing: document.getElementById('marketing-emails').checked
        };
        
        const response = await fetch('/api/users/notifications', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(settings)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || 'Failed to update notification settings');
        }
    }
    
    
    async function savePrivacySettings() {
        const settings = {
            profileVisibility: document.getElementById('profile-visibility').checked,
            contactInfoVisibility: document.getElementById('contact-info-visibility').checked,
            activityTracking: document.getElementById('activity-tracking').checked
        };
        
        const response = await fetch('/api/users/privacy', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(settings)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || 'Failed to update privacy settings');
        }
    }
    
    
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});
