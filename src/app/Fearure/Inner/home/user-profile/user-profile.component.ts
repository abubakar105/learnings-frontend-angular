import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { passwordMatchValidator, strongPasswordValidator } from '../../../../Shared/CustomValidator/strongPasswordValidator';

// Import your custom validators (same ones used in RegisterUserComponent)
// import {
//   strongPasswordValidator,
//   passwordMatchValidator,
// } from '../../../Shared/CustomValidator/strongPasswordValidator';

interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard' | 'American Express' | 'Discover';
  last4: string;
  expiry: string; // e.g. "12/2025"
}

interface Order {
  number: string;
  date: Date;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  // Toggle flags
  editingProfile = false;
  showChangePasswordForm = false;
  showPaymentMethods = false;

  // In‐memory “user” data
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    shippingAddress: '123 Main St, Apt 4B, Springfield, IL 62704, USA',
    billingAddress: '456 Oak Avenue, Suite 200, Springfield, IL 62701, USA',
    avatarUrl: 'https://via.placeholder.com/80',
    joinDate: new Date(2023, 0, 1), // January 1, 2023
  };

  // Reactive form group for “Edit Profile”
  profileForm!: FormGroup;

  // Reactive form group for “Change Password”
  changePasswordForm!: FormGroup;

  // Dummy payment methods & orders
  paymentMethods: PaymentMethod[] = [
    {
      id: 'visa-4242',
      type: 'Visa',
      last4: '4242',
      expiry: '12/2025',
    },
    {
      id: 'mc-5678',
      type: 'Mastercard',
      last4: '5678',
      expiry: '03/2024',
    },
  ];

  recentOrders: Order[] = [
    {
      number: 'ORDER-12345',
      date: new Date(2024, 1, 20),
      total: 76.49,
      status: 'Shipped',
    },
    {
      number: 'ORDER-12344',
      date: new Date(2024, 1, 15),
      total: 45.2,
      status: 'Delivered',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Build the “Edit Profile” form
    this.profileForm = this.fb.group({
      name: [
        this.user.name,
        [Validators.required, Validators.maxLength(50)],
      ],
      email: [
        this.user.email,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      phone: [
        this.user.phone,
        [
          Validators.required,
          Validators.pattern(/^[0-9+\-\s()]{10,20}$/), // digits, +, -, spaces
        ],
      ],
      shippingAddress: [
        this.user.shippingAddress,
        [Validators.required, Validators.maxLength(200)],
      ],
      billingAddress: [
        this.user.billingAddress,
        [Validators.required, Validators.maxLength(200)],
      ],
    });
    this.profileForm.disable(); // Start disabled until “Edit” is clicked

    // Build the “Change Password” form
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, strongPasswordValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: passwordMatchValidator }
    );
    this.changePasswordForm.disable();
  }

  // Convenience getters for form controls
  get pf(): { [key: string]: AbstractControl } {
    return this.profileForm.controls;
  }

  get cpf(): { [key: string]: AbstractControl } {
    return this.changePasswordForm.controls;
  }

  // ========== Toggle “Edit Profile” Mode ==========
  toggleEditProfile() {
    // If opening “Edit”, ensure Change Password is closed
    if (!this.editingProfile) {
      if (this.showChangePasswordForm) {
        this.showChangePasswordForm = false;
        this.changePasswordForm.reset();
        this.changePasswordForm.disable();
      }
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        shippingAddress: this.user.shippingAddress,
        billingAddress: this.user.billingAddress,
      });
      this.profileForm.enable();
    } else {
      // Cancelling “Edit”
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        shippingAddress: this.user.shippingAddress,
        billingAddress: this.user.billingAddress,
      });
      this.profileForm.disable();
    }
    this.editingProfile = !this.editingProfile;
  }

  // ========== Save “Edit Profile” ==========
  onSaveProfile() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      this.user.name = this.pf['name'].value;
      this.user.email = this.pf['email'].value;
      this.user.phone = this.pf['phone'].value;
      this.user.shippingAddress = this.pf['shippingAddress'].value;
      this.user.billingAddress = this.pf['billingAddress'].value;

      this.editingProfile = false;
      this.profileForm.disable();
      alert('Profile saved successfully (dummy).');
    }
  }

  // ========== Toggle “Change Password” Form ==========
toggleChangePasswordForm() {
    if (!this.showChangePasswordForm) {
      // If opening, close “Edit Profile” if active
      if (this.editingProfile) {
        this.editingProfile = false;
        this.profileForm.disable();
      }
      this.changePasswordForm.reset();
      this.changePasswordForm.enable();
    } else {
      // If closing, reset & disable
      this.changePasswordForm.reset();
      this.changePasswordForm.disable();
    }
    this.showChangePasswordForm = !this.showChangePasswordForm;
  }


  // ========== Submit “Change Password” ==========
onSubmitChangePassword() {
    this.changePasswordForm.markAllAsTouched();
    if (this.changePasswordForm.valid) {
      // In a real app, verify currentPassword, then update with newPassword.
      alert('Password updated successfully (dummy).');
      this.showChangePasswordForm = false;
      this.changePasswordForm.reset();
      this.changePasswordForm.disable();
    }
  }


  // ========== Delete Account (dummy) ==========
  onDeleteAccount() {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmed) {
      this.user = {
        name: '',
        email: '',
        phone: '',
        shippingAddress: '',
        billingAddress: '',
        avatarUrl: '',
        joinDate: new Date(),
      };
      this.paymentMethods = [];
      this.recentOrders = [];
      this.profileForm.disable();
      this.changePasswordForm.disable();
      this.editingProfile = false;
      this.showChangePasswordForm = false;
      alert('Account deleted (dummy).');
    }
  }

  // ========== Payment Methods ==========
  togglePaymentMethods() {
    this.showPaymentMethods = !this.showPaymentMethods;
  }

  onAddPaymentMethod() {
    const dummyId = `amex-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newCard: PaymentMethod = {
      id: dummyId,
      type: 'American Express',
      last4: Math.floor(Math.random() * 9000 + 1000).toString(),
      expiry: '11/2026',
    };
    this.paymentMethods.push(newCard);
    alert('Added new payment method (dummy).');
  }

  onRemovePaymentMethod(cardId: string) {
    this.paymentMethods = this.paymentMethods.filter(
      (card) => card.id !== cardId
    );
    alert(`Removed payment method ${cardId} (dummy).`);
  }

  // ========== Orders ==========
  onViewAllOrders() {
    alert('Navigating to All Orders page... (dummy)');
  }
}
