import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import { ensureSystemFolders } from '@/lib/folder-helpers';

export async function POST() {
  try {
    // Get the authenticated user from Supabase Auth
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user exists in our database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1);

    let userProfile;

    if (existingUser.length === 0) {
      // Create new user profile
      const newUser = await db
        .insert(users)
        .values({
          id: authUser.id,
          email: authUser.email!,
          displayName: authUser.user_metadata?.display_name || null,
          avatarUrl: authUser.user_metadata?.avatar_url || null,
        })
        .returning();

      userProfile = newUser[0];
      
      // Initialize system folders for new user
      await ensureSystemFolders(authUser.id);
    } else {
      // Update existing user profile (in case email or metadata changed)
      const updated = await db
        .update(users)
        .set({
          email: authUser.email!,
          displayName: authUser.user_metadata?.display_name || existingUser[0].displayName,
          avatarUrl: authUser.user_metadata?.avatar_url || existingUser[0].avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, authUser.id))
        .returning();

      userProfile = updated[0];
    }

    return NextResponse.json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    console.error('Profile sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync profile' },
      { status: 500 }
    );
  }
}
