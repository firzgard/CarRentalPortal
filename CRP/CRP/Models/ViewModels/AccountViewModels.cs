﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CRP.Models
{
	public class ExternalLoginConfirmationViewModel
	{
		[Required]
		[Display(Name = "Email")]
		public string Email { get; set; }
	}

	public class ExternalLoginListViewModel
	{
		public string ReturnUrl { get; set; }
	}

	public class SendCodeViewModel
	{
		public string SelectedProvider { get; set; }
		public ICollection<System.Web.Mvc.SelectListItem> Providers { get; set; }
		public string ReturnUrl { get; set; }
		public bool RememberMe { get; set; }
	}

	public class VerifyCodeViewModel
	{
		[Required]
		public string Provider { get; set; }

		[Required]
		[Display(Name = "Code")]
		public string Code { get; set; }
		public string ReturnUrl { get; set; }

		[Display(Name = "Remember this browser?")]
		public bool RememberBrowser { get; set; }

		public bool RememberMe { get; set; }
	}

	public class ForgotViewModel
	{
		[Required]
		[Display(Name = "Email")]
		public string Email { get; set; }
	}

	public class LoginViewModel
	{
		[Required]
		[Display(Name = "Email")]
		[EmailAddress]
		public string Email { get; set; }

		[Required]
		[DataType(DataType.Password)]
		[Display(Name = "Password")]
		public string Password { get; set; }

		[Display(Name = "Remember me?")]
		public bool RememberMe { get; set; }
	}

	public class RegisterViewModel
	{
        [Required(ErrorMessage = "Xin vui lòng nhập tên tài khoản!", AllowEmptyStrings = false)]
        [StringLength(15, ErrorMessage = "Username phải có ít nhất 1 ký tự và ít hơn 15 kí tự", MinimumLength = 1)]
        [Display(Name = "Username")]
		public string Username { get; set; }

       
        [Display(Name = "Full Name")]
        [StringLength(50, ErrorMessage = "Fullname phải có ít nhất 1 ký tự", MinimumLength = 1)]
        public string Fullname { get; set; }

		[Required]
		[EmailAddress]
		[Display(Name = "Email")]
		public string Email { get; set; }

		[Required]
		[EmailAddress]
		[Display(Name = "Confirm Email")]
		[Compare("Email", ErrorMessage = "Email xác thực không giống nhau.")]
		public string ConfirmEmail { get; set; }

		[Required]
		[StringLength(100, ErrorMessage = "Có ít nhất 6 ký tự", MinimumLength = 6)]
		[DataType(DataType.Password, ErrorMessage = "Mật khẩu phải có ký tự hoa và số")]
        [Display(Name = "Password")]
		public string Password { get; set; }

		[DataType(DataType.Password)]
		[Display(Name = "Confirm password")]
		[Compare("Password", ErrorMessage = "Mật khẩu không khớp")]
		public string ConfirmPassword { get; set; }

		[Required]
		[StringLength(30, ErrorMessage = "Tối thiểu có 2 ký tự và ít hơn 30 kí tự", MinimumLength = 1)]
		[Display(Name = "PhoneNumber")]
		public string PhoneNumber { get; set; }
	}

    public class createNewGarageViewModel
    {
        [Required]
        [Display(Name = "Garage Name")]
        public string GarageName { get; set; }

        [Required]
        [Display(Name = "Location")]
        public string LocationID { get; set; }

        [Required]
        [Display(Name = "Address")]
        public string Address { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "The {0} must be at least {2} characters.", MinimumLength = 2)]
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "PhoneNumber")] 
        public string PhoneNumber { get; set; }
}


    public class ResetPasswordViewModel
	{
		[Required]
		[EmailAddress]
		[Display(Name = "Email")]
		public string Email { get; set; }

		[Required]
		[StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
		[DataType(DataType.Password)]
		[Display(Name = "Password")]
		public string Password { get; set; }

		[DataType(DataType.Password)]
		[Display(Name = "Confirm password")]
		[Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
		public string ConfirmPassword { get; set; }

		public string Code { get; set; }
	}

	public class ForgotPasswordViewModel
	{
		[Required]
		[EmailAddress]
		[Display(Name = "Email")]
		public string Email { get; set; }
	}
}
