using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BloodBridge.Model;
using BloodBridge.DTOs;
using BloodBridge.DTOs.AuthDtos;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
using BloodBridge.DTOs.DonationDto;

namespace BloodBridge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonorsController : ControllerBase
    {
        private BloodBridgeDbContext _dbContext;
        public DonorsController(BloodBridgeDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        [HttpPost("CompleteProfile")]
        [Authorize(Roles = "Donor")]
        public async Task<IActionResult> CompleteProfile([FromBody] DororDto dto)
        {

            var UserIdString = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var UsreId = int.Parse(UserIdString);
            var existing = _dbContext.Donors.Any(a => a.UserId == UsreId);
            if (existing) { return BadRequest(); }
            var donor = new Donors
            {
                UserId = UsreId,
                BloodType = dto.BloodType,
                City = dto.City,
                LastDonation = dto.LastDonation.HasValue ? DateTime.SpecifyKind(dto.LastDonation.Value, DateTimeKind.Utc) : null,
                IsAvailable = dto.LastDonation == null || (DateTime.Now - dto.LastDonation.Value).Days >= 90
            };

            _dbContext.Donors.Add(donor);
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Profile completed successfully" });
        }



        [HttpGet("GetDonor")]
        [Authorize(Roles = "Donor")]
        public async Task<IActionResult> GetDonor()
        {
            var UserIdString = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var UsreId = int.Parse(UserIdString);
            var donor = await _dbContext.Donors.Where(d => d.UserId == UsreId).Select(d => new
            {
                d.Id,
                d.BloodType,
                d.City,
                d.IsAvailable,
                d.LastDonation
            }).FirstOrDefaultAsync();
            if (donor == null) { return NotFound(); }
            return Ok(donor);
        }

        [HttpGet("GetAllDonors")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllDonors()
        {
            var data = _dbContext.Donors.Include(d => d.User).Select(x => new
            {
                x.Id,
                x.BloodType,
                x.City,
                x.IsAvailable,
                x.LastDonation
            }).ToList();

            return Ok(data);
        }
        [HttpPost("CreateDonation")]
        [Authorize(Roles = "Donor")]
        public async Task<IActionResult> CreateDonation([FromBody] DonationDto dto)
        {
            var UserIdString = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var UserId = int.Parse(UserIdString);

            var donor = await _dbContext.Donors.FirstOrDefaultAsync(d => d.UserId == UserId);
            if (donor == null)
                return BadRequest("Donor profile not found");

            var exists = await _dbContext.Donations
                .AnyAsync(d => d.DonorId == donor.Id && d.RequestId == dto.RequestId);

            if (exists)
                return BadRequest("You already donated for this request");

            var donation = new Donations
            {
                DonorId = donor.Id,
                RequestId = dto.RequestId,
                DonationDate = DateTime.UtcNow,
                Status = "Pending",
                Notes = dto.Notes
            };

            _dbContext.Donations.Add(donation);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Donation request sent successfully" });
        }

        [Authorize(Roles = "Hospital")]
        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> ConfirmDonation(long id)
        {
            var donation = await _dbContext.Donations.FirstOrDefaultAsync(d => d.Id == id);
            if (donation == null) return NotFound("Donation not found");

            if (donation.Status != "Pending") return BadRequest("Donation is not pending");

            donation.Status = "Confirmed";

            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Donation confirmed successfully" });
        }

        [Authorize(Roles = "Hospital")]
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectDonation(long id)
        {
            var donation = await _dbContext.Donations.FirstOrDefaultAsync(d => d.Id == id);
            if (donation == null) return NotFound("Donation not found");
            if (donation.Status != "Pending") return BadRequest("Donation is not pending");

            donation.Status = "Rejected";

            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Donation rejected successfully" });
        }

        [Authorize(Roles = "Donor")]
        [HttpGet("MyDonations")]
        public async Task<IActionResult> MyDonations()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userId = int.Parse(userIdString);

            var donor = await _dbContext.Donors.FirstOrDefaultAsync(d => d.UserId == userId);
            if (donor == null) return NotFound("Donor not found");

            var donations = await _dbContext.Donations
                .Where(d => d.DonorId == donor.Id)
                .Select(d => new
                {
                    d.Id,
                    d.RequestId,
                    d.DonationDate,
                    d.Status,
                    d.Notes
                }).ToListAsync();

            return Ok(donations);
        }
    }
}
